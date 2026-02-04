import { Component, computed, effect, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TccStore } from '../../store/tcc-store';
import { TCC } from '../../model/tcc-model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../service/auth.service'; // Importação do serviço de autenticação

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

  // Injeção do AuthService para gerenciar o encerramento de sessão seguro (Req 4)
  private authService = inject(AuthService);

  // TCC selecionado
  selectedTcc = computed<TCC | null>(() => {
    const list = this.tccs();
    const id = this.selectedTccId();

    if (!Array.isArray(list)) return null;
    if (id === null) return null;

    return list.find((t: TCC) => t.id === id) ?? null;
  });

  constructor(
    private store: TccStore, 
    private sanitizer: DomSanitizer, 
    private router: Router
  ) {
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
      this.store.removeTcc(id);
      this.closeModal();
    }
  }

  editTcc(tcc: any) {
    this.router.navigate(['/cadastro'], { queryParams: { id: tcc.id } });
  }
  
  /**
   * Realiza o logout chamando o AuthService.
   * Isso garante que o servidor Java receba a ordem para limpar o Cookie HttpOnly.
   */
  logout() {
    // Agora o logout segue o fluxo de segurança do Requisito 4
    this.authService.logout(); 
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