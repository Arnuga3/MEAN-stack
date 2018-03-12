export class User {
  id: string;
  email: string;
  username: string;
  password: string;

  constructor(id='', email='', username='', password='') {
    this.id = id
    this.email = email
    this.username = username
    this.password = password
  }
}