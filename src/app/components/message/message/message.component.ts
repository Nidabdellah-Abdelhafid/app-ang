import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { JwtTokenService } from 'src/app/services/jwt-token.service';
import { MessageService } from 'src/app/services/message/message.service';
import { environment } from 'src/environments/environment';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import { UserService } from 'src/app/services/user.service';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT'
}

interface Message {
  id: number;
  contenu: string;
  date: Date;
  status: boolean;
  mediaUrl?: string;  // Changed from MessageType to string
  mediaType?: string;
  fileName?: string;
  messageType?: MessageType;  // This should be of type MessageType
  sender: any;
  receiver: any;
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  isAdmin: boolean = false;
  currentUserEmail: string = '';
  currentUser: any = null;
  messages: Message[] = [];
  newMessage: string = '';
  selectedFile: File | null = null;
  filePreview: string | null = null;
  private stompClient: Client;
  users: any[] = [];
  selectedUser: any = null;
  filteredMessages: Message[] = [];
  isProfileOpen: boolean = false;
  showScrollButton = false;
  private shouldScrollToBottom = true;
  isImageModalOpen: boolean = false;
  selectedImage: SafeResourceUrl | null = null;
  isSending: boolean = false;

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

  onScroll(event: any): void {
    const element = event.target;
    const scrollPosition = element.scrollHeight - element.scrollTop;
    const threshold = element.clientHeight + 300;
    this.showScrollButton = scrollPosition > threshold;
    // Prevent auto-scroll when user is scrolling up
    this.shouldScrollToBottom = false;
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
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

  decodeUser(base64String: string): SafeResourceUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64String);
  }

  decode(data: string | undefined): SafeResourceUrl {
    if (!data) return '/assets/img/logo_atlas.jpg';
    
    // For uploaded files
    return this._sanitizer.bypassSecurityTrustResourceUrl(`${environment.apiUrl}/uploads/${data}`);
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.filterMessages();
    this.scrollToBottom();
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
    this.shouldScrollToBottom = true;
  }

  

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.filePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.filePreview = null;
      }
    }
  }

  removeSelectedFile() {
    this.selectedFile = null;
    this.filePreview = null;
  }

  sendMessage() {
    if (!this.currentUser || (!this.newMessage.trim() && !this.selectedFile) || !this.selectedUser) {
      return;
    }

    this.isSending = true;

    const messageData = {
      contenu: this.newMessage.trim() || (this.selectedFile ? this.selectedFile.name : ''),
      date: new Date().toISOString(),
      sender: this.currentUserEmail,
      receiver: this.selectedUser.email,
      status: false,
      messageType: this.selectedFile ? 
        (this.selectedFile.type.startsWith('image/') ? MessageType.IMAGE : MessageType.DOCUMENT) : 
        MessageType.TEXT,
      fileName: this.selectedFile ? this.selectedFile.name : undefined
    };

    const formData = new FormData();
    formData.append('message', JSON.stringify(messageData));
    
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    if (this.newMessage.trim() && this.selectedFile) {
      // Send text message first
      const textMessageData = {
        ...messageData,
        contenu: this.newMessage.trim(),
        messageType: MessageType.TEXT,
        fileName: undefined
      };
      
      const textFormData = new FormData();
      textFormData.append('message', JSON.stringify(textMessageData));
      
      this.messageService.create(textFormData).subscribe({
        next: () => {
          // Then send file message
          this.messageService.create(formData).subscribe({
            next: this.handleMessageResponse.bind(this),
            error: (error) => {
              console.error('Error sending file message:', error);
              this.isSending = false;
            }
          });
        },
        error: error => {
          console.error('Error sending text message:', error);
          this.isSending = false;
        }
      });
    } else {
      // Send single message (either text or file)
      this.messageService.create(formData).subscribe({
        next: this.handleMessageResponse.bind(this),
        error: (error) => {
          console.error('Error sending message:', error);
          this.isSending = false;
        }
      });
    }
  }

  private handleMessageResponse(response: any) {
    this.messages.push(response);
    this.newMessage = '';
    this.selectedFile = null;
    this.filePreview = null;
    this.messageService.getAll().subscribe({
      next: (data: any) => {
        this.messages = (data as Message[]).sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        this.filterMessages();
        this.shouldScrollToBottom = true;
      }
    });
    this.isSending = false;
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      this.showScrollButton = false;
    } catch(err) { }
  }

  toggleUserProfile() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  openImageModal(imageUrl: SafeResourceUrl) {
  this.selectedImage = imageUrl;
  this.isImageModalOpen = true;
}

  closeImageModal() {
    this.selectedImage = null;
    this.isImageModalOpen = false;
  }
}