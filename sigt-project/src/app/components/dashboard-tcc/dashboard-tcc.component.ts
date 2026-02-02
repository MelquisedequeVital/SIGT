import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TccStore } from '../../store/tcc-store';
import { TCC } from '../../model/tcc-model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-dashboard-tcc',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-tcc.component.html',
  styleUrls: ['./dashboard-tcc.component.css'],
})
export class DashboardTccComponent implements OnInit {
  tccs: any;
  loading: any;
  error: any;

  // id selecionado na lista
  selectedTccId = signal<number | null>(null);

  // controle do modal
  showModal = signal(false);

  // TCC selecionado
  selectedTcc = computed<TCC | null>(() => {
    const list = this.tccs();
    const id = this.selectedTccId();

    if (!Array.isArray(list)) return null;
    if (id === null) return null;

    return list.find((t: TCC) => t.id === id) ?? null;
  });

  constructor(private store: TccStore, private sanitizer: DomSanitizer, private router: Router) {
    this.tccs = this.store.tccList$;
    this.loading = this.store.loading$;
    this.error = this.store.error$;



    effect(() => {
      if (this.error()) {
        setTimeout(() => this.store.clearError(), 3000);
      }
    });
  }

  ngOnInit(): void {
    this.store.loadTccs();
  }

  selectTcc(id?: number) {
    this.selectedTccId.set(id ?? null);
    if (id) {
      this.showModal.set(true);
    }
  }

  deleteTcc(id: number) {
    if (confirm('Deseja realmente excluir este agendamento? Esta ação não pode ser desfeita.')) {
      this.store.removeTcc(id); // Chama o método de delete da sua Store
      this.closeModal(); // Fecha o modal caso esteja aberto
    }
  }

  editTcc(tcc: any) {
    // Redireciona para a página de cadastro passando o ID para edição
    // Certifique-se de que sua rota /cadastro aceite o ID (ex: /cadastro/:id)
    this.router.navigate(['/cadastro'], { queryParams: { id: tcc.id } });
  }
  
  logout() {
    localStorage.removeItem('token'); // Remove a credencial
    this.router.navigate(['/login']); // Redireciona para o login
  }

  closeModal() {
    this.showModal.set(false);
  }

  formatDate(d?: string) {
    if (!d) return '-';
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  }

  getSafeHtml(htmlPuro: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(htmlPuro);
  }
}
