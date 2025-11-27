import { Injectable, signal, computed } from '@angular/core';
import { TccService } from '../service/tcc-service';
import { TCC } from '../model/tcc-model';

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

  constructor(private tccService: TccService) {}

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
    this.tccService.updateTcc(id, tcc).subscribe({
      next: () => this.loadTccs(),
      error: () => this.error.set('Erro ao atualizar TCC'),
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
