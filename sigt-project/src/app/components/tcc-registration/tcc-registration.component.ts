import { Component, effect, signal, OnInit } from '@angular/core'; // Adicionado OnInit
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Adicionado ActivatedRoute e Router
import { TccStore } from '../../store/tcc-store';
import { TCC } from '../../model/tcc-model';

@Component({
  selector: 'app-tcc-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tcc-registration.component.html',
  styleUrls: ['./tcc-registration.component.css'],
})
export class TccRegistrationComponent implements OnInit { // Implementando OnInit
  form: FormGroup;
  success = signal<boolean>(false);

  // Variáveis para controle de edição
  idParaEdicao = signal<number | null>(null);
  isEditMode = signal<boolean>(false);

  readonly loading;
  readonly error;
  readonly minDate: string;

  constructor(
    private fb: FormBuilder,
    private store: TccStore,
    private route: ActivatedRoute, // Injetado
    private router: Router         // Injetado
  ) {
    this.loading = this.store.loading$;
    this.error = this.store.error$;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];

    this.form = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)]],
      studentId: ['', [Validators.required, Validators.pattern('^[0-9]{5,11}$')]],
      advisorName: ['', Validators.required],
      title: ['', Validators.required],
      summary: [''],
      modality: ['presencial'],
      scheduledDate: [''],
      scheduledTime: [''],
      location: [''],
      committee: [''],
      status: ['cadastrada'],
      
    });

    effect(() => {
      if (this.store.error$() || this.success()) {
        setTimeout(() => {
          this.store.clearError();
          this.success.set(false);
        }, 4000);
      }
    });
  }

  // MÉTODO NOVO: Detecta se é edição ao carregar a página
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        const id = +params['id'];
        this.idParaEdicao.set(id);
        this.isEditMode.set(true);
        this.carregarDadosParaEdicao(id);
      }
    });
  }

  // MÉTODO NOVO: Preenche o formulário com dados existentes
  private carregarDadosParaEdicao(id: number) {
    const tcc = this.store.tccList$().find(t => t.id === id);
    if (tcc) {
      this.form.patchValue({
        ...tcc,
        committee: tcc.committee?.join(', ') // Converte array para string para o input
      });
    }
  }

  onNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g, '');
    input.value = sanitizedValue;
    this.form.get('studentName')?.setValue(sanitizedValue, { emitEvent: false });
  }

  private isFutureDate(d?: string): boolean {
    if (!d) return true;
    const selected = new Date(d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    return selected > today;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    if (value.scheduledDate && !this.isFutureDate(value.scheduledDate)) {
      this.form.get('scheduledDate')?.setErrors({ notFuture: true });
      this.form.markAllAsTouched();
      return;
    }

    const payload: TCC = {
      id: this.idParaEdicao() || undefined, // Inclui o ID se for edição
      studentName: value.studentName!.trim(),
      studentId: value.studentId!,
      advisorName: value.advisorName!,
      title: value.title!,
      summary: value.summary || undefined,
      status: value.status || this.store.tccList$().find(t => t.id === this.idParaEdicao())?.status || 'cadastrada',
      modality: value.modality,
      scheduledDate: value.scheduledDate || undefined,
      scheduledTime: value.scheduledTime || undefined,
      location: value.location || undefined,
      committee: value.committee
        ? (Array.isArray(value.committee) ? value.committee : value.committee.split(',').map((s: string) => s.trim()))
        : [],
    };

    // LÓGICA DE DECISÃO: UPDATE OU ADD
    if (this.isEditMode() && this.idParaEdicao()) {
      // 1. Chame a store. O redirecionamento e o erro agora serão 
      // controlados POR ELA no subscribe que ajeitamos.
      this.store.updateTcc(this.idParaEdicao()!, payload);

      // APAGUE as linhas de success.set e router.navigate daqui de dentro!
    } else {
      // 2. Se for um novo cadastro, mantemos a lógica local de sucesso
      this.store.addTcc(payload);
      this.success.set(true);
      this.form.reset({ modality: 'presencial' });
    }
  }
}