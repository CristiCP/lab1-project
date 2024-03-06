class Player {
  private name: string;
  private nationality: string;
  private team: string;
  private age: number;

  constructor(name: string, nationality: string, team: string, age: number) {
    this.name = name;
    this.nationality = nationality;
    this.team = team;
    this.age = age;
  }

  getName() {
    return this.name;
  }

  getNationality() {
    return this.nationality;
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
