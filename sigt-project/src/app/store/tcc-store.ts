import { Injectable, signal, computed } from '@angular/core';
import { TccService } from '../service/tcc-service';
import { TCC } from '../model/tcc-model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TccStore {
  private tccList = signal<TCC[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  tccList$ = computed(() => this.tccList());
  loading$ = computed(() => this.loading());
  error$ = computed(() => this.error());

  constructor(private tccService: TccService, private router: Router) { }

  loadTccs() {
    this.loading.set(true);
    this.error.set(null);

    this.tccService.getTccs().subscribe({
      next: (data) => {
        this.tccList.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar TCCs');
        this.loading.set(false);
      },
    });
  }

  addTcc(tcc: TCC) {
    this.tccService.createTcc(tcc).subscribe({
      next: () => this.loadTccs(),
      error: () => this.error.set('Erro ao criar TCC'),
    });
  }

  updateTcc(id: number, tcc: TCC) {
    this.loading.set(true);
    this.error.set(null); // Limpa erros anteriores antes de começar

    this.tccService.updateTcc(id, tcc).subscribe({
      next: () => {
        // SÓ ENTRA AQUI SE O JAVA RESPONDER 200 OK
        this.loadTccs();
        this.loading.set(false);
        // Redireciona direto para o dashboard após o sucesso
        this.router.navigate(['/agenda-tcc']);
      },
      error: (err) => {
        // SE DER ERRO NO JAVA (400, 404, 500), ENTRA AQUI
        console.error('Erro detalhado do servidor:', err);
        this.error.set('Erro ao atualizar TCC. Verifique os campos.');
        this.loading.set(false);
      },
    });
  }



  removeTcc(id: number) {
    this.tccService.deleteTcc(id).subscribe({
      next: () => this.loadTccs(),
      error: () => this.error.set('Erro ao excluir TCC'),
    });
  }

  clearError() {
    this.error.set(null);
  }
}
