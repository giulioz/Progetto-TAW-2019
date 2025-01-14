import { Component, OnInit } from '@angular/core';

import { CashierStatisticsService } from '../../../../services/User/Cashier/cashier-statistics/cashier-statistics.service';
import { SocketService } from '../../../../services/socket/socket.service';
import { Router } from "@angular/router";
import { User } from 'src/app/classes/user';


@Component({
  selector: 'app-cashier-statistics',
  templateUrl: './cashier-statistics.component.html',
  styleUrls: ['./cashier-statistics.component.scss']
})
export class CashierStatisticsComponent implements OnInit {

  view_users: Boolean;
  allUsers: User[];

  constructor(
    private cashierStatisticsService: CashierStatisticsService,
    private router: Router,
    private socketService: SocketService) { }

  ngOnInit() {
    this.initIoConnection();
    this.view_users = false;
    this.allUsers = [];
    this.getAllUsers();
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.socketService
      .newAction()
      .subscribe(user => {
        console.log("A NEW USER ACTION", user);
        const indexPresent = this.allUsers.findIndex(elem => elem.email == user.email);
        if (indexPresent != -1)
          this.allUsers[indexPresent] = new User(user);
        else {
          this.allUsers.push(new User(user));
          if (this.allUsers.length > 0)
            this.view_users = true;
          //this.view_tables = true;
        }
      });
  }

  async getAllUsers(): Promise<void> {
    try {
      let CashierStatisticsServicePromise = await this.cashierStatisticsService.getAllUsers();
      // ritorna l'observable...
      CashierStatisticsServicePromise.subscribe(
        (ResSub => {
          // L'AccessToken è valido: o perchè NON era scaduto oppure perchè il refresh è avvenuto in maniara corretta
          if (ResSub.length == 0) {
            //this.view_tables = false;
          }
          else {
            console.log(ResSub);
            //for(let i=0;i<ResSub.length;++i)
            //this.myTables.push(new Table(ResSub[i]));
            ResSub.forEach(element => {
              this.allUsers.push(new User(element));
            });
            if (this.allUsers.length > 0)
              this.view_users = true;
            //this.view_tables = true;
          }
        }),
        (ErrSub => {
          // necessario il catch della promise non gestisce l'errore dell'observable
          // E' avvenuto un errore con il refresh dell'AccessToken: è necessario un nuovo login
          this.router.navigate(['/auth/login']);
          // da andare in pagina di login
          console.log("SEND ORDER err", ErrSub);
        })
      )
    } catch (errorPromise) {
      this.router.navigate(['/auth/login']);
      // da andare in pagina di login, MA: sarebbe poi da fare un back a questa pagina quando si è fatto effettivamente il login
      console.log("sono qui");
      console.log("SEND ORDER err", errorPromise);
    }
  }

}
