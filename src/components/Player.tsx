class Player {
  private name: string;
  private country: string;
  private team: string;
  private age: number;

  constructor(name: string, country: string, team: string, age: number) {
    this.name = name;
    this.country = country;
    this.team = team;
    this.age = age;
  }

  getName() {
    return this.name;
  }

  getNationality() {
    return this.country;
  }

  getTeam() {
    return this.team;
  }

  getAge() {
    return this.age;
  }

  setTeam(newTeam: string) {
    this.team = newTeam;
  }
}

export default Player;
