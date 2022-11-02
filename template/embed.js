const { guild } = member;
		//let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices //RETURNS NUMBER 
		const EmbedTitle = options.getString("title"); //same as in StringChoices //RETURNS STRING 
		const EmbedDescription = options.getString("description"); //same as in StringChoices //RETURNS STRING 
		const EmbedColor = options.getString("color"); //same as in StringChoices //RETURNS STRING 
		//let UserOption = options.getUser("OPTIONNAME"); //RETURNS USER OBJECT 
		const ChannelOption = options.getChannel("in_where"); //RETURNS CHANNEL OBJECt
		//let RoleOption = options.getRole("OPTIONNAME"); //RETURNS ROLE OBJECT
		const channel = ChannelOption && ["GUILD_PRIVATE_THREAD ", "GUILD_PUBLIC_THREAD ", "GUILD_NEWS_THREAD ", "GUILD_NEWS", "GUILD_TEXT"].includes(ChannelOption.type) ? ChannelOption : guild.channels.cache.get(channelId);

    let embed = new MessageEmbed().setColor(EmbedColor ? EmbedColor : "BLURPLE")

		.setTitle(String(EmbedTitle).substr(0, 256))

		.setDescription(String(EmbedDescription).substr(0, 2048).split("+n+").join("\n"))

		.setFooter(guild.name, guild.iconURL({dynamic: true}));

		await channel.send({embeds: [embed]}).catch((err) => {
      console.log(`❌: Cant DM ${user.tag} (probably disable his DM)`); 
    }).then(() => {
       console.log(`✅: Embed Send to ${user.tag}, now waiting for the ban... `);
    });