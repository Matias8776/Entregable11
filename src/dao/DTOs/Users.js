export default class UserDTO {
  constructor (user) {
    this.name = user.user.name.replace(/\b\w/g, l => l.toUpperCase());
    this.age = user.user.age;
    this.role = user.user.role.replace(/\b\w/g, l => l.toUpperCase());
  }
}
