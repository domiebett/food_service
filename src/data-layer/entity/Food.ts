import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { MinLength } from 'class-validator';
import { Meal } from './Meal';

@Entity()
export class Food {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 150,
        unique: true
    })
    @MinLength(2)
    name: string;

    @ManyToMany(type => Meal, meal => meal.foods)
    meals: Meal[];

    @Column('integer')
    userId: number;
}

export interface IFood {
    id?: number;
    name: string;
}
