export type TodayMealDesc = {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
};

export interface MealData {
    facility_id: number;
    today_meal_desc: string; // JSON string containing TodayMealDesc
    breakfast_meal_picture_url: string | null;
    lunch_meal_picture_url: string | null;
    dinner_meal_picture_url: string | null;
    week_meal_picture_url: string | null;
    meal_date: string; // ISO date string
    created_at: string;
    updated_at: string;
}

export interface MealsApiResponse {
    Message: string;
    ResultCode: string;
    Response: MealData | null;
}

export default MealsApiResponse;
