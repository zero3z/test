const path = require('node:path');
const axios = require("axios")
const permissions = {
  AddReactions: "Thêm Biểu Cảm",
  Administrator: "Người Quản Lý",
  AttachFiles: "Đính Kèm Tập Tin",
  BanMembers: "Cấm Thành Viên",
  ChangeNickname: "Thay Đổi Biệt Danh",
  Connect: "Kết Nối",
  DeafenMembers: "Tắt Âm Thành Viên",
  EmbedLinks: "Nhúng Liên Kết",
  KickMembers: "Khai Trừ Thành Viên",
  ManageChannels: "Quản Lý Kênh",
  ManageEmojisAndStickers: "Quản Lý Emoji Và Sticker",
  ManageMessages: "Quản Lý Tin Nhắn",
  ManageNicknames: "Quản Lý Biệt Danh",
  ManageRoles: "Quản Lý Vai Trò",
  ManageThreads: "Quản Lý Threads",
  ManageWebhooks: "Quản Lý Webhooks",
  MentionEveryone: "Đề Cập Everyone",
  ModerateMembers: "Quản Lý Thành Viên",
  MoveMembers: "Di Chuyển Thành Viên",
  MuteMembers: "Tắt Nghe Thành Viên",
  ReadMessageHistory: "Xem Lịch Sử Tin Nhắn",
  SendMessages: "Gửi Tin Nhắn",
  SendMessagesInThreads: "Gửi Tin Nhắn Trong Chủ Đề",
  Speak: "Nói",
  Stream: "Video",
  UseExternalEmojis: "Dùng Emoji Mở Rộng",
  UseExternalStickers: "Dùng Sticker Mở Rộng",
};
const cooldownSchema = require('../Databases/Models/cooldownSchema');
const praySchema = require('../Databases/Models/praySchema');
const moneySchema = require('../Databases/Models/moneySchema');

module.exports = (client) => {
  client.parsePerm = function(perms) {
    return perms.map((perm) => permissions[perm]).join(", ");
  }


  client.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  client.secondsToDhms = (seconds) => {
    seconds = Number(seconds);
    const monthInSeconds = 86400 * 31;
    const dayInSeconds = 3600 * 24;
    const hourInSeconds = 3600;
    const minuteInSeconds = 60;

    const mth = Math.floor(seconds / monthInSeconds);
    seconds %= monthInSeconds;
    const d = Math.floor(seconds / dayInSeconds);
    seconds %= dayInSeconds;
    const h = Math.floor(seconds / hourInSeconds);
    seconds %= hourInSeconds;
    const m = Math.floor(seconds / minuteInSeconds);
    const s = Math.round(seconds % minuteInSeconds);

    let result = '';
    if (mth > 0) result += mth + ' tháng ';
    if (d > 0) result += d + ' ngày ';
    if (h > 0) result += h + ' giờ ';
    if (m > 0) result += m + ' phút ';
    if (s > 0) result += s + ' giây';

    return result;
  };

  client.deleteMsg = async function(message, content, delay, type) {
    if (type && type.toLowerCase() === "reply") {
      await message.reply({
        content: content
      }).then(m => {
        setTimeout(() => {
          m.delete();
        }, delay)
      })
    }
    else {
      await message.channel.send({
        content: content
      }).then(m => {
        setTimeout(() => {
          m.delete();
        }, delay)
      })
    }
  }
  client.getUser = async function(message, toFind, authorReturn = true) {
    if (!toFind) return authorReturn ? message.member : null;

    let target;
    const patternMatch = toFind.match(/<?@?!?(\d{17,20})>?/)
    if (patternMatch) {
      const id = patternMatch[1]
      target = await message.guild.members.fetch({ user: id }).catch(() => { });
    }
    else if (toFind.startsWith("@")) {
      const mentionUser = toFind.replace("@", '');
      target = message.guild.members.cache.find((member) =>
        member.user.tag.toLowerCase() === mentionUser
      )
    }

    if (!target) {
      target =
        message.guild.members.cache.get(toFind) ||
        message.guild.members.cache.find((member) =>
          member.user.username.toLowerCase() === toFind ||
          member.displayName.toLowerCase() === toFind ||
          member.user.tag.toLowerCase() === toFind ||
          member.user.id === toFind
        );
    }

    if (!target) {
      const fetchedMembers = await message.guild.members.fetch({ query: toFind, limit: 1 });
      target = fetchedMembers.first();
    }

    if (!target) target = authorReturn ? message.member : null;

    return target;
  }

  client.fetchUser = async function(id) {
    try {
      const response = await axios.get(`https://discord.com/api/users/${id}`, {
        headers: {
          Authorization: `Bot ${process.env.token}`,
        },
      })

      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error.message);
      throw error;
    }
  }

  client.timeout = async function(id, cmd) {
    let data = await cooldownSchema.findOne({ key: `${id}.${cmd}` });
    if (data) {
      data.cooldown = Date.now();
    } else {
      data = new cooldownSchema({ key: `${id}.${cmd}`, cooldown: Date.now() });
    }
    await data.save();
  };

  client.cd = async function(id, cmd) {
    const data = await cooldownSchema.findOne({ key: `${id}.${cmd}` });
    if (!data) return null;
    return data.cooldown;
  };

  client.checkcd = function(date, cd) {
    const timeout = date + cd;
    const diff = Date.now() - timeout;
    const temp = Math.abs(Math.floor(diff / 1000));
    const seconds = temp % 60;
    const minutes = Math.floor((temp / 60) % 60);
    const hours = Math.floor((temp / (60 * 60)) % 24);
    const days = Math.floor(temp / (24 * 60 * 60));

    if (!date) {
      return {
        after: true,
        s: seconds,
        m: minutes,
        h: hours,
        d: days
      };
    }

    if (diff <= 0) {
      return {
        after: false,
        diff,
        s: seconds,
        m: minutes,
        h: hours,
        d: days
      };
    } else {
      return {
        after: true,
        diff,
        withinDay: false,
        s: seconds,
        m: minutes,
        h: hours,
        d: days
      };
    }
  };

  client.checknewday = async function(id, cmd) {
    let date;
    let dates = await cooldownSchema.findOne({ key: `${id}.${cmd}.24h` });

    if (!dates) {
      date = null;
      dates = new cooldownSchema({
        key: `${id}.${cmd}.24h`,
        cooldown: Date.now()
      });
    } else {
      date = dates.cooldown;
      dates.cooldown = Date.now();
    }

    await dates.save();

    let now = new Date(Date.now() + 25200000);
    let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(Date.now() + 25200000));

    /* Tính toán thời gian đến nửa đêm */
    let temp = Math.trunc(((midnight - now) + 86400000) / 1000);
    let seconds = temp % 60;
    temp = Math.trunc(temp / 60);
    let minutes = temp % 60;
    temp = Math.trunc(temp / 60);
    let hours = temp % 24;
    temp = Math.trunc(temp / 24);
    let days = temp;

    /* Nếu không có dữ liệu */
    if (!date) {
      return { after: true, seconds, minutes, hours, days, now };
    }

    let pDate = new Date(date + 25200000);
    let diff = midnight - pDate;

    /* Chưa qua nửa đêm */
    if (diff < 0) {
      return { after: false, diff, seconds, minutes, hours, days, now };
    }

    /* Trong vòng 1 ngày */
    else if (diff < 172810000) {
      return { after: true, diff, withinDay: true, seconds, minutes, hours, days, now };
    }

    /* Quá 1 ngày đầy đủ */
    else {
      return { after: true, diff, withinDay: false, seconds, minutes, hours, days, now };
    }
  }

  client.prayed = async function(id) {
    let data = await praySchema.findOne({ id });
    return data ? data.prays : 0;
  };

  client.congpray = async function(id, prays) {
    let data = await praySchema.findOne({ id });
    if (data) {
      data.prays += prays;
    } else {
      data = new praySchema({ id: id, prays: 1 });
    }
    await data.save();
  };

  client.trupray = async function(id, prays) {
    let data = await praySchema.findOne({ id });
    if (data) {
      data.prays -= prays;
    } else {
      data = new praySchema({ id: id, prays: -1 });
    }
    await data.save();
  }

  client.cash = async function(id) {
    const data = await moneySchema.findOne({ id })
    return data ? data.moneys : 0;
  };

  client.congcash = async function(id, money) {
    let data = await moneySchema.findOne({ id })
    if (!data) {
      data = new moneySchema({ id: id, moneys: money })
    } else {
      data.moneys += money;
    }
    await data.save()
  };

  client.trucash = async function(id, money) {
    let data = await moneySchema.findOne({ id })
    if (!data) {
      data = new moneySchema({ id: id, moneys: -money })
    } else {
      data.moneys -= money
    }
    await data.save()
  }
}