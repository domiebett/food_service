import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany } from 'typeorm';
import { Food } from './Food';
import { IsIn } from 'class-validator';

export enum MealType {
    Dinner = 'Dinner',
    Lunch = 'Lunch',
    Breakfast = 'Breakfast',
    Snack = 'Snack'
}

@Entity()
export class Meal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: '20'
    })
    @IsIn(Object.values(MealType))
    type: MealType;

    @Column('integer')
    userId: number;

    @ManyToMany(type => Food, food => food.meals)
    @JoinTable()
    foods: Food[];
}
