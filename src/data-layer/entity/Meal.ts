import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany } from 'typeorm';
import { Food } from './Food';
import { IsIn } from 'class-validator';

export enum MealType {
    DINNER = 'dinner',
    LUNCH = 'lunch',
    BREAKFAST = 'breakfast',
    SNACK = 'snack',
    SUPPER = 'supper',
    BRUNCH = 'brunch'
}

@Entity()
export class Meal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    @IsIn(Object.values(MealType))
    type: MealType;

    @Column('integer')
    userId: number;

    @ManyToMany(type => Food, food => food.meals)
    @JoinTable()
    foods: Food[];

    foodIds: number[];
}

export interface IMeal {
    id?: number,
    type: MealType,
    userId?: number,
    foods?: Food[],
    foodIds?: number[]
}
