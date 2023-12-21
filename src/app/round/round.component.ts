import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  NgModel,
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { concat } from 'rxjs';

interface Player {
  firstName: String;
  lastName: String;
  grade: number;
}

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.css'],
})
export class RoundComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private fb: FormBuilder
  ) {}

  footballForm: FormGroup;
  selectedPlayer: string = '';
  selectedPlayers: string[] = [];
  players: string[] = [];
  teamOrange: string[] = [];
  teamGreen: string[] = [];
  teamBlue: string[] = [];
  teamGray: string[] = [];
  scorer: string = '';
  table: any;

  ngOnInit(): void {
    this.footballForm = this.fb.group({
      game1: this.fb.group({
        scorers1: this.fb.array([]),
        scorers2: this.fb.array([]),
        scorers3: this.fb.array([]),
        scorers4: this.fb.array([]),
      }),
    });

    this.http
      .get<Player[]>('http://localhost:8080/players')
      .subscribe((response) => {
        const playersListElement = document.getElementById('playersList');
        if (playersListElement) {
          response.forEach((player) => {
            const option = document.createElement('option');
            option.value = `${player.firstName}${player.lastName}`;
            playersListElement.appendChild(option);
          });
        }
      });
  }

  findFirstEmptyPosition() {
    const table = document.getElementById('teams');
    if (table) {
      const rows = table.getElementsByTagName('tr');
      for (let j = 0; j < rows[0].cells.length; j++) {
        for (let i = 0; i < rows.length; i++) {
          const cellContent = rows[i].cells[j].innerText.trim();
          if (cellContent === '') {
            return { row: i, column: j };
          }
        }
      }
    }
    return null;
  }

  attendPlayer() {
    this.table = document.getElementById('teams') as HTMLTableElement;
    const emptyPosition = this.findFirstEmptyPosition();
    if (emptyPosition && this.table && this.selectedPlayer !== '') {
      const { row, column } = emptyPosition;
      const cell = this.table.rows[row].cells[column];
      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-button');
      cell.innerHTML = '';
      cell.textContent = this.selectedPlayer;
      cell.appendChild(deleteIcon);
      this.selectedPlayer = '';
    }
  }

  trashIconDelete(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (targetElement.classList.contains('delete-button')) {
      const cell = targetElement.parentNode as HTMLElement;
      if (cell) {
        cell.innerHTML = '';
        cell.remove;
      }
    }
  }

  submitTeams() {
    this.removeDeleteButtons();
    const table = document.getElementById('teams');
    if (table) {
      const rows = table.getElementsByTagName('tr');
      for (let j = 0; j < rows[0].cells.length; j++) {
        for (let i = 0; i < rows.length; i++) {
          const cellContent = rows[i].cells[j].innerText;
          if (cellContent !== '') {
            this.players.push(cellContent);
          } else {
            alert('There are players missing');
            //   this.players = [];    DECOMMENT THIS IS THE FURURE
            return;
          }
        }
      }
    }
    this.createTeams();
  }

  createTeams() {
    const rows = this.table.getElementsByTagName('tr');
    let cellContent;
    for (let j = 0; j < rows[0].cells.length; j++) {
      for (let i = 0; i < rows.length; i++) {
        cellContent = rows[i].cells[j].innerText;
        switch (j) {
          case 0:
            this.teamOrange.push(cellContent);
            break;
          case 1:
            this.teamGreen.push(cellContent);
            break;
          case 2:
            this.teamBlue.push(cellContent);
            break;
          case 3:
            this.teamGray.push(cellContent);
        }
      }
    }
  }

  removeDeleteButtons() {
    const rows = this.table.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td');
      for (let j = 0; j < cells.length; j++) {
        const deleteButton = cells[j].querySelector('.delete-button');
        if (deleteButton) {
          deleteButton.remove();
        }
      }
    }
  }
  get scorers1(): FormArray {
    return this.footballForm.get('game1').get('scorers1') as FormArray;
  }

  get scorers2(): FormArray {
    return this.footballForm.get('game1').get('scorers2') as FormArray;
  }

  get scorers3(): FormArray {
    return this.footballForm.get('game1').get('scorers3') as FormArray;
  }

  get scorers4(): FormArray {
    return this.footballForm.get('game1').get('scorers4') as FormArray;
  }

  @ViewChild('introdu1Btn') introdu1Btn: HTMLElement;

  adaugaMarcator(event: Event) {
    console.log('inside adauga marcator');
    const button = event.target as HTMLElement;
    const selectElement = button.parentNode.querySelector(
      '.selectare'
    ) as HTMLSelectElement;
    const gameNr = button.parentNode.querySelector('h3').innerHTML;
    const selectValue = selectElement.value;

    let selectedScorers: FormArray;

    switch (selectValue) {
      case 'Verde':
        selectedScorers = this.scorers1;
        break;
      case 'Portocaliu':
        selectedScorers = this.scorers2;
        break;
      case 'Albastru':
        selectedScorers = this.scorers3;
        break;
      case 'Gri':
        selectedScorers = this.scorers4;
        break;
    }
    //selectedScorers.push(this.fb.control(''));

    if (selectedScorers) {
      selectedScorers.push(this.fb.control(''));
    } else {
      console.error('Selected Scorers is null or undefined.');
    }
  }

  removeScorer(i: number, theFormArray: FormArray) {
    const array = theFormArray;
    theFormArray.removeAt(i);
  }

  onSubmit() {
    console.log(this.footballForm);
  }
}
