// import database
const postgreDb = require("../config/postgre");

const getProducts = (queryParams) => {
  return new Promise((resolve, reject) => {
    const { search, categories, sort, limit, page } = queryParams;
    let query =
      "select p.product_name, p.price, p.image, c.category_name, p.description from products p join categories c on c.id = p.category_id left join transactions t on t.product_id = p.id ";
    let countQuery =
      "select count(*) as count from products p join categories c on c.id = p.category_id left join transactions t on t.product_id = p.id ";

    let checkWhere = true;
    let link = "http://localhost:8060/api/v1/products?";

    if (search) {
      link += `search${search}&`;
      query += `${
        checkWhere ? "WHERE" : "AND"
      } lower(p.product_name) like lower('%${search}%') `;
      countQuery += `${
        checkWhere ? "WHERE" : "AND"
      } lower(p.product_name) like lower('%${search}%') `;
      checkWhere = false;
    }

    if (categories && categories !== "") {
      query += `${
        checkWhere ? "WHERE" : "AND"
      } lower(c.category_name) like lower('${categories}') `;

      countQuery += `${
        checkWhere ? "WHERE" : "AND"
      } lower(c.category_name) like lower('${categories}') `;

      checkWhere = false;
      link += `categories=${categories}&`;
    }

    if (sort) {
      query += "group by p.id, c.category_name ";
      if (sort.toLowerCase() === "popular") {
        query += "order by count(t.qty) desc ";
        link += "sort=popular&";
      }
      if (sort.toLowerCase() === "oldest") {
        query += "order by p.created_at asc ";
        link += "sort=oldest&";
      }
      if (sort.toLowerCase() === "newest") {
        query += "order by p.created_at desc ";
        link += "sort=newest&";
      }
      if (sort.toLowerCase() === "cheapest") {
        query += "order by p.price asc ";
        link += "sort=cheapest&";
      }
      if (sort.toLowerCase() === "priciest") {
        query += "order by p.price desc ";
        link += "sort=prciest&";
      }
    }
    query += "limit $1 offset $2";
    console.log(query);
    console.log(link);
    const sqlLimit = limit ? limit : 10;
    const sqlOffset =
      !page || page === "1" ? 0 : (parseInt(page) - 1) * parseInt(sqlLimit);

    // console.log(countQuery);
    console.log(sqlLimit);
    postgreDb.query(countQuery, (err, result) => {
      if (err) return reject(err);
      // return resolve(result.rows);
      const totalData = result.rows[0].count;
      const currentPage = page ? parseInt(page) : 1;
      const totalPage =
        parseInt(sqlLimit) > totalData
          ? 1
          : Math.ceil(totalData / parseInt(sqlLimit));

      const prev =
        currentPage - 1 <= 0
          ? null
          : link + `page=${currentPage - 1}&limit=${parseInt(sqlLimit)}`;

      const next =
        currentPage + 1 >= totalPage
          ? null
          : link + `page=${currentPage + 1}&limit=${parseInt(sqlLimit)}`;

      const meta = {
        page: currentPage,
        totalPage,
        limit: parseInt(sqlLimit),
        totalData: parseInt(totalData),
        prev,
        next,
      };
      console.log(totalPage, currentPage);
      postgreDb.query(query, [sqlLimit, sqlOffset], (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        return resolve({
          result: {
            msg: "List products",
            data: result.rows,
            meta,
          },
        });
      });
    });
  });
};

const createProducts = (body, file) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now() / 1000;
    const query =
      "insert into products (product_name, price, image, category_id, description, created_at, update_at) values ($1, $2, $3, $4, $5, to_timestamp($6), to_timestamp($7))";
    const { product_name, price, category_id, description } = body;
    const imageUrl = file.filename;
    postgreDb.query(
      query,
      [
        product_name,
        price,
        imageUrl,
        category_id,
        description,
        timestamp,
        timestamp,
      ],
      (err, queryResult) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(queryResult);
      }
    );
  });
};

const editProducts = (body, id, file) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now() / 1000;
    let query = "update products set ";
    let imageUrl = null;
    const input = [];
    if (file) {
      imageUrl = `${file.filename}`;
      if (Object.keys(body).length === 0) {
        query += `image = '${imageUrl}', update_at = to_timestamp($1) where id = $2 returning product_name`;
        input.push(timestamp, id);
      }
      if (Object.keys(body).length > 0) {
        query += `image = '${imageUrl}', `;
      }
    }

    Object.keys(body).forEach((element, index, array) => {
      if (index === array.length - 1) {
        query += `${element} = $${index + 1} where id = $${
          index + 2
        } returning product_name`;
        input.push(body[element], id);
        return;
      }
      query += `${element} = $${index + 1}, `;
      input.push(body[element]);
    });

    postgreDb
      .query(query, input)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

const dropProducts = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from products where id = $1";
    postgreDb.query(query, [params.id], (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
  });
};

const productsRepo = {
  getProducts,
  createProducts,
  editProducts,
  dropProducts,
};

module.exports = productsRepo;
