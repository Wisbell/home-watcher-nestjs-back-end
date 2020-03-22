export class User {
  constructor(
    username: string,
    password: string
  ) {
    this.username = username;
    this.password = password;
  }

  userId: number;
  username: string;
  password: string;
  role: string; // admin | basic

  static getMaxId(users: User[]): number {
    let maxId: number = 0;

    if (users) {
      users.forEach( (user) => {
        if (user.userId > maxId)
          maxId = user.userId;
      });

      return maxId + 1;
    }

    return 1;
  }
}
