import { IcategoryResponse } from "../interfaces/IcategoryResponse";

export function isValidCategoryName(categoryNamesFromGet: string[], categoriesDBlist: IcategoryResponse[]): boolean {
    if (Array.isArray(categoryNamesFromGet) && Array.isArray(categoriesDBlist)) {
        return categoryNamesFromGet.every((categoryName) =>
            categoriesDBlist.some((category) => String(category.categoryname) === categoryName)
        );
    } else {
        return false;
    }
}
