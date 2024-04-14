const dailySchema = require("../../Databases/Models/dailySchema")

module.exports = {
  name: "daily",
  group: "economy",
  aliases: [],
  cooldown: 5,
  description: "Nhận phần thưởng hàng ngày",
  usage: "{prefix}daily",
  async execute(client, message, args) {
    let New = false;
    let dailyData = await dailySchema.findOne({ id: message.author.id })
    if (!dailyData) {
      dailyData = new dailySchema({
        id: message.author.id,
        streaks: 1
      })
      await dailyData.save()
      New = true;
    }
    let canUse = await client.checknewday(message.author.id, "daily");
    let after = canUse.after;
    let h = canUse.hours;
    let m = canUse.minutes;
    let s = canUse.seconds;
    let withinDay = canUse.withinDay;
    if (!after) {
      return client.deleteMsg(message, `${client.e.error} Bạn đã nhận phần thưởng của ngày hôm nay rồi! Vui lòng quay lại sau ${h}h ${m}m ${s}s`, 5000, "reply")
    } 
    else {
      let gain = 700 + Math.floor(Math.random() * 200);
      if (!withinDay && New) {
        gain += dailyData.streaks * 25; 
        await client.congcash(message.author.id, gain)
        
        await message.channel.send(`<a:dm_money:1141861189421387816> **| ${message.author.username}**, Bạn nhận được <:dm_carrot:1141829466604187699> **${parseInt(gain).toLocaleString("en-us")} Carro**
<a:dm_blueheart:1141797750443364493> **|** Bạn đã điểm danh được **${parseInt(dailyData.streaks).toLocaleString("en-us")} ngày**`)
      }
      else if (!withinDay && !New) {
        dailyData.streaks = 1;
        await dailyData.save()
        
        gain += dailyData.streaks * 25
        await client.congcash(message.author.id, gain);
        
        await message.channel.send(`<a:dm_money:1141861189421387816> **| ${message.author.username}**, Bạn nhận được <:dm_carrot:1141829466604187699> **${parseInt(gain).toLocaleString("en-us")} Carro**
<a:dm_blueheart:1141797750443364493> **|** Bạn đã bỏ lỡ điểm danh hằng ngày!`) 
      }
      else if (withinDay) {
        dailyData.streaks += 1;
        await dailyData.save()
        
        gain += dailyData.streaks * 25
        await client.congcash(message.author.id, gain);
        
        await message.channel.send(`<a:dm_money:1141861189421387816> **| ${message.author.username}**, Bạn nhận được <:dm_carrot:1141829466604187699> **${parseInt(gain).toLocaleString("en-us")} Carro**
<a:dm_blueheart:1141797750443364493> **|** Bạn đã điểm danh được **${parseInt(dailyData.streaks).toLocaleString("en-us")} ngày**`)
      }
    }
  },  
};