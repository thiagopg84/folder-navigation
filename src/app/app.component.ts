import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  rows: MyCustomObject[] = [
    {
      _id: '1',
      name: 'Object 1'
    },
    {
      _id: '2',
      name: 'Object 2'
    },
    {
      _id: '3',
      name: 'Object 3'
    },
    {
      _id: '4',
      name: 'Object 4'
    },
    {
      _id: '5',
      name: 'Object 5'
    },
    {
      _id: '6',
      name: 'Object 6'
    },
    {
      _id: '7',
      name: 'Object 7'
    },
    {
      _id: '8',
      name: 'Object 8'
    },
    {
      _id: '9',
      name: 'Object 9'
    },
    {
      _id: '10',
      name: 'Object 10'
    }
  ];
  rowsSet = new Set<MyCustomObject>();
  selectedRows = new Set<MyCustomObject>();
  lastSelectedIndex!: number;
  clickTimeout: any;

  ngOnInit(): void {
    this.getExistingRows();
  }

  @HostListener('document:click', ['$event'])
  logClick(event: any): void {
    const classes: Record<number, string> = event.target.classList;
    const isObjectContainer = Object.values(classes).some((cssClass) => cssClass === 'objects');
    if (isObjectContainer) {
      this.clearSelection();
    }
  }

  getExistingRows(): void {
    this.rows.map((row) => {
      this.rowsSet.add(row);
    });
  }

  onRowClick(row: MyCustomObject, event: MouseEvent, index: number): void {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }

    this.clickTimeout = setTimeout(() => {
      if (event.ctrlKey || event.metaKey) {
        this.toggleSelection(row);
      } else if (event.shiftKey) {
        this.selectRange(index);
      } else {
        if (this.selectedRows.has(row) && this.selectedRows.size === 1) {
          this.selectedRows.delete(row);
        } else {
          this.clearSelection();
          this.selectedRows.add(row);
        }
      }
      this.lastSelectedIndex = index;
    }, 250);
  }

  toggleSelection(row: MyCustomObject) {
    if (this.selectedRows.has(row)) {
      this.selectedRows.delete(row);
    } else {
      this.selectedRows.add(row);
    }
  }

  selectRange(index: number) {
    if (this.lastSelectedIndex !== null) {
      const start = Math.min(this.lastSelectedIndex, index);
      const end = Math.max(this.lastSelectedIndex, index);
      this.clearSelection();
      for (let i = start; i <= end; i++) {
        this.selectedRows.add(this.rows[i]);
      }
    }
  }

  clearSelection() {
    this.selectedRows.clear();
  }

  onRowDblClick(row: MyCustomObject): void {
    this.clearSelection();
    this.toggleSelection(row);
    clearTimeout(this.clickTimeout);
    this.log(row);
  }

  log(row: MyCustomObject): void {
    console.log(row.name);
  }

  showSelected(): void {
    console.log(Array.from(this.selectedRows));
  }
}

interface MyCustomObject {
  name: string;
  _id: string;
}
