module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', { // MySQL에는 images 테이블 생성
    // id가 기본적으로 들어있다.
    src: {
        type: DataTypes.STRING(200),
        allowNull: true,  // 필수 아님
    },
  }, {
      // user 모델에 대한 세팅
    charset: 'utf8',
    collate: 'utf8_general_ci', // 한글 저장
  });
    Image.associate = (db) => {
      // image는 post에 속해 있다. 
      db.Image.belongsTo(db.Post);
    };
    return Image;
};

