module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define('Hashtag', { // MySQL에는 hashtags 테이블 생성
  // id가 기본적으로 들어있다.
  name: {
    type: DataTypes.STRING(20),
    allowNull: false,  // 필수
  },
}, {
    // user 모델에 대한 세팅 (mb4 - 이모티콘을 위함)
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci', // 한글 저장
});
  Hashtag.associate = (db) => {
    // 하나의 post에 여러개의 hashtag 가능하고 하나의 hashtag 또한 여러개의 post에 가능 (다대다)
    db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
  };
  return Hashtag;
};