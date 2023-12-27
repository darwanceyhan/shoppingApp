export let productsQuery: string = `
                        SELECT productname, price, stockquantity, categoryname
                        FROM products
                        INNER JOIN categories ON products.categoryid = categories.categoryid
                    `;