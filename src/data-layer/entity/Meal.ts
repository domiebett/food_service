import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany } from 'typeorm';
import { Food } from './Food';

@Entity()
export class Meal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: '20'
    })
    type: MealType;

    @ManyToMany(type => Food, food => food.meals)
    @JoinTable()
    foods: Food[];
}

export enum MealType {
    Dinner = 'Dinner',
    Lunch = 'Lunch',
    Breakfast = 'Breakfast',
    Snack = 'Snack'
}
