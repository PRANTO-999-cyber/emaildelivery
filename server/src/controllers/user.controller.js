export const getUsers = async (req, res) => {
  res.json({
    message: "Users list",
  });
};

export const getProfile = async (req, res) => {
  res.json({
    message: "Profile",
  });
};

export const updateUser = async (req, res) => {
  res.json({
    message: "User updated",
  });
};

export const deleteUser = async (req, res) => {
  res.json({
    message: "User deleted",
  });
};
