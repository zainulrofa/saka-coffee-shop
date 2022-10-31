const allowedRoles = (...allowed) => {
  return (req, res, next) => {
    const role = req.userPayload.role;

    let isAllowed = false;
    for (let allowedRole of allowed) {
      if (allowedRole !== role) continue;
      isAllowed = true;
      break;
    }
    if (!isAllowed) return res.status(403).json({ msg: "forbidden" });
    next();
  };
};

module.exports = allowedRoles;
