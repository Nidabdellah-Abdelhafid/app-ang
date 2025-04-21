import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { JwtTokenService } from 'src/app/services/jwt-token.service';
import { MessageService } from 'src/app/services/message/message.service';
import { environment } from 'src/environments/environment';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import { UserService } from 'src/app/services/user.service';

interface Message {
  id: number;
  contenu: string;
  date: Date;
  status: boolean;
  mediaUrl?: string;
  mediaType?: string;
  fileName?: string;
  messageType?: string;
  sender: any;
  receiver: any;
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit , AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  isAdmin: boolean = false;
  currentUserEmail: string = '';
  currentUser: any = null;
  messages: Message[] = [];
  newMessage: string = '';
  selectedFile: File | null = null;
  private stompClient: Client;
  users: any[] = [];
  selectedUser: any = null;
  filteredMessages: Message[] = [];

  constructor(private messageService: MessageService, 
              private jwtTokenService: JwtTokenService,
              private userService: UserService,
              public _sanitizer: DomSanitizer) {
    const token = this.jwtTokenService.getAccess_token();
    
    this.stompClient = new Client({
      webSocketFactory: () => {
        const socket = new SockJS(`${environment.apiUrl}/ws`);
        (socket as any).transportOptions = {
          'xhr': {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        };
        return socket;
      },
      connectHeaders: {
        'Authorization': `Bearer ${token}`
      },
      onConnect: () => {
        console.log('Connected to WebSocket');
        this.subscribeToMessages();
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      }
    });
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  
  ngOnInit(): void {
      this.currentUser = this.jwtTokenService.getEmail();
      if (this.currentUser) {
        this.currentUserEmail = this.currentUser;
      }
    this.getMessages();
    this.stompClient.activate();
    this.loadUsers();
    
  }
loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users: any) => {
        this.users = users.filter((user:any) => user.email !== this.currentUserEmail);
      },
      error: (error) => console.error('Error loading users:', error)
    });
  }
  getMessages() {
    this.messageService.getAll().subscribe({
      next: (data: any) => {
        this.messages = (data as Message[]).sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      },
      error: (error) => {
        console.error('Error loading messages:', error);
      }
    });
  }

  private subscribeToMessages() {
    if (this.currentUserEmail) {
      this.stompClient.subscribe(`/user/${this.currentUserEmail}/queue/messages`, message => {
        const newMessage = JSON.parse(message.body);
        this.messages.push(newMessage);
      });
    }
  
  }

  decode(base64String: string): SafeResourceUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64String);
  }

  

  selectUser(user: any) {
    this.selectedUser = user;
    this.filterMessages();
  }

  filterMessages() {
    if (!this.selectedUser) {
      this.filteredMessages = [];
      return;
    }
    
    this.filteredMessages = this.messages.filter(message => 
      (message.sender?.email === this.currentUserEmail && message.receiver?.email === this.selectedUser.email) ||
      (message.sender?.email === this.selectedUser.email && message.receiver?.email === this.currentUserEmail)
    );
    setTimeout(() => this.scrollToBottom(), 100);
  }

  sendMessage() {
    if (!this.currentUser || !this.newMessage.trim() || !this.selectedUser) {
      return;
    }

    // Create message object
    const messageData = {
      contenu: this.newMessage.trim(),
      date: new Date().toISOString(),
      sender: this.currentUserEmail,
      receiver: this.selectedUser.email,
      status: false
    };

    const formData = new FormData();
    formData.append('message', JSON.stringify(messageData));
    
    this.messageService.create(formData).subscribe({
      next: (response: any) => {
        this.messages.push(response);
        this.newMessage = '';
        this.selectedFile = null;
        this.messageService.getAll().subscribe({
          next: (data: any) => {
            this.messages = (data as Message[]).sort((a, b) => 
              new Date(a.date).getTime() - new Date(b.date).getTime()
            );
            this.filterMessages();
            this.scrollToBottom();
          }
        });
      },
      error: error => console.error('Error sending message:', error)
    });
}
}