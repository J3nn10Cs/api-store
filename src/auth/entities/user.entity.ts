import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
