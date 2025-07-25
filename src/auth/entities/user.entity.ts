import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name : 'users'
})
export class User {
  
  @PrimaryGeneratedColumn('uuid')
  id : string

  @Column('text', {
    unique: true,
    nullable: false,
  })
  email : string;

  @Column('text', {
    nullable: false,
    //no show password
    select: false,
  })
  password : string;

  @Column('text', {
    nullable: false,
  })
  fullName : string;

  @Column('boolean', {
    default: true,
  })
  isActive : boolean;

  @Column('text', {
    array: true,
    default : []
  })
  role : string[];

  @BeforeInsert()
  checkFieldsBeforeInsert(){
    this.email = this.email.toLowerCase().trim();
    this.fullName = this.fullName.trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate(){
    this.checkFieldsBeforeInsert();
  }
}
