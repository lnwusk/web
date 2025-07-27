const { ActivityRegistration, User, Activity } = require('./models');

async function testRegistrations() {
  try {
    console.log('=== 测试报名记录查询 ===');
    
    // 检查所有报名记录
    const allRegistrations = await ActivityRegistration.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        },
        {
          model: Activity,
          as: 'activity',
          attributes: ['id', 'title']
        }
      ]
    });
    
    console.log('总报名记录数:', allRegistrations.length);
    
    if (allRegistrations.length > 0) {
      console.log('报名记录详情:');
      allRegistrations.forEach((reg, index) => {
        console.log(`${index + 1}. 用户: ${reg.user?.username} (ID: ${reg.userId})`);
        console.log(`   活动: ${reg.activity?.title} (ID: ${reg.activityId})`);
        console.log(`   状态: ${reg.status}`);
        console.log(`   报名时间: ${reg.registrationTime}`);
        console.log('---');
      });
    } else {
      console.log('没有找到任何报名记录');
    }
    
    // 检查特定用户的报名记录
    if (allRegistrations.length > 0) {
      const firstUserId = allRegistrations[0].userId;
      console.log(`\n检查用户ID ${firstUserId} 的报名记录:`);
      
      const userRegistrations = await ActivityRegistration.findAll({
        where: { userId: firstUserId },
        include: [
          {
            model: Activity,
            as: 'activity',
            include: [
              {
                model: User,
                as: 'organizer',
                attributes: ['id', 'username']
              }
            ]
          }
        ]
      });
      
      console.log(`用户 ${firstUserId} 的报名记录数:`, userRegistrations.length);
    }
    
  } catch (error) {
    console.error('测试失败:', error);
  } finally {
    process.exit(0);
  }
}

testRegistrations(); 