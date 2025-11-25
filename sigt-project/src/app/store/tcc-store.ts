import { Injectable, signal, computed } from '@angular/core';
import { TccService } from '../service/tcc-service';

@Injectable({
  providedIn: 'root',
})
export class TccStore {
  private tasks = signal<any[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  tasks$ = computed(() => this.tasks());
  loading$ = computed(() => this.loading());
  error$ = computed(() => this.error());

  constructor(private tccService: TccService) {}

  loadTasks() {
    this.loading.set(true);
    this.error.set(null);

    this.tccService.getTasks().subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar dados');
        this.loading.set(false);
      },
    });
  }

  addTask(task: any) {
    this.tccService.createTask(task).subscribe({
      next: () => this.loadTasks(),
      error: () => this.error.set('Erro ao criar registro'),
    });
  }

  updateTask(id: number, task: any) {
    this.tccService.updateTask(id, task).subscribe({
      next: () => this.loadTasks(),
      error: () => this.error.set('Erro ao atualizar'),
    });
  }

  removeTask(id: number) {
    this.tccService.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
      error: () => this.error.set('Erro ao excluir'),
    });
  }
}
