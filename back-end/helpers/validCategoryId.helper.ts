import { IcategoryResponse } from "../interfaces/IcategoryResponse";
export function isValidCategoryId(categoryId: string, categories: IcategoryResponse[]): boolean {
    if (Array.isArray(categories)) {
        return categories.some((category) => String(category.categoryid) === categoryId);
    }
    else {
        return false
    }
}