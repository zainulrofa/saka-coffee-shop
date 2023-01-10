const validate = {
  body: (...allowedBody) => {
    return (req, res, next) => {
      const { body } = req;
      const sanitizedBody = Object.keys(body).filter((e) =>
        allowedBody.includes(e)
      );

      const newBody = {};
      for (let key of sanitizedBody) {
        if (!body[key]) return res.status(400).json({ msg: `${key} is empty` });
        Object.assign(newBody, { [key]: body[key] });
      }
      if (Object.keys(newBody).length === 0)
        return res.status(400).json({ msg: "Nothing inserted" });
      if (Object.keys(newBody).length !== allowedBody.length)
        return res.status(400).json({ msg: "Body doesnt meet required input" });
      req.body = newBody;
      next();
    };
  },
  query: (...allowedBody) => {
    return (req, res, next) => {
      const { query } = req;
      const sanitizedQuery = Object.keys(query).filter((e) =>
        allowedBody.includes(e)
      );

      const newQuery = {};
      for (let key of sanitizedQuery) {
        Object.assign(newQuery, { [key]: query[key] });
      }
      if (Object.keys(newQuery).length === 0)
        return res.status(400).json({ msg: "Nothing inserted" });

      req.query = newQuery;
      next();
    };
  },
  patchBody: (...allowedBody) => {
    return (req, res, next) => {
      const { body } = req;
      const sanitizedBody = Object.keys(body).filter((e) =>
        allowedBody.includes(e)
      );

      const newBody = {};
      for (let key of sanitizedBody) {
        if (!body[key]) return res.status(400).json({ msg: `${key} is empty` });
        Object.assign(newBody, { [key]: body[key] });
      }
      next();
    };
  },
  params: (...allowedKeys) => {
    return (req, res, next) => {
      const { params } = req;
      const sanitizedKey = Object.keys(params).filter((key) =>
        allowedKeys.includes(key)
      );
      const newParams = {};
      for (let key of sanitizedKey) {
        Object.assign(newParams, { [key]: params[key] });
      }
      req.params = newParams;
      next();
    };
  },
  email: (...allowedKeys) => {
    return (req, res, next) => {
      const { body } = req;
      const sanitizedKey = Object.keys(body).filter((key) =>
        allowedKeys.includes(key)
      );
      const newBody = {};
      for (let key of sanitizedKey) {
        if (key == "email" && typeof key == "string") {
          let atps = body[key].indexOf("@");
          let dots = body[key].lastIndexOf(".");
          if (atps < 1 || dots < atps + 2 || dots + 2 >= body[key].length) {
            return res
              .status(400)
              .json({ msg: "Error Input Data Email!", data: null });
          }
        }
        if (key == "phone") {
          let regexPhone =
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
          if (!regexPhone.test(body[key])) {
            return res
              .status(400)
              .json({ msg: "wrong input number phone", data: null });
          }
        }
        if (key == "password") {
          if (body[key].length < 8) {
            return res
              .status(400)
              .json({ msg: "password is at least 8 letters", data: null });
          }
        }
        Object.assign(newBody, { [key]: body[key] });
      }
      req.body = newBody;
      next();
    };
  },
};

module.exports = validate;
