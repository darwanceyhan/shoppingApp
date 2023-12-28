let productsQuery: string = `
  SELECT 
    productname,
    price,
    stockquantity,
    categoryname
  FROM products
  INNER JOIN categories ON products.categoryid = categories.categoryid
`;

export const modifiedQuery = (queryName?: string, inQueryFilterNumbers?: string): string => {
  const filters: string[] = [];

  if (inQueryFilterNumbers) {
    filters.push(`categories.categoryname IN (${inQueryFilterNumbers})`);
  }

  if (queryName) {
    filters.push(`products.productname LIKE '%${queryName}%'`);
  }
  const filtersClause = filters.length > 0 ? `WHERE ${filters.length > 1 ? filters.join(' AND ') : filters.join('')}` : '';

  return `${productsQuery}  ${filtersClause}`;
};
