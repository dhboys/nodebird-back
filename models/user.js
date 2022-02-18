module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', { // MySQL에는 users 테이블 생성
  // id가 기본적으로 들어있다.
  email: {
    type: DataTypes.STRING(30),   // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME ..
    allowNull: false, // 필수
    unique: true,  // 고유한 값
  },
  nickname: {
    type: DataTypes.STRING(30),
    allowNull: false, // 필수
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false, // 필수
  },
}, {
  // user 모델에 대한 세팅
  charset: 'utf8',
  collate: 'utf8_general_ci', // 한글 저장
});
  User.associate = (db) => {
    // 한 사람이 post 여러개 가질 수 있다.
    db.User.hasMany(db.Post);
    // 한 사람이 댓글을 여러개 가질 수 있다.
    db.User.hasMany(db.Comment);
    // 좋아요(User)와 Post의 관계는 다대다 (through를 통해 중간 테이블명을 정할 수 있다) + ( as를 통해 alias를 줄 수 있다)
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
    // user 간에도 다대다가 형성된다 (following), foreignKey 설정할 때 주의 -> 누가 following 했는지 찾으려면 먼저 followerId를 찾고 following 한 대상들을 찾아야한다. 
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' });
  };
  return User;
};