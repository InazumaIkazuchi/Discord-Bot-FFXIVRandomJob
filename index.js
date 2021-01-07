const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
require('dotenv').config();

const COMMAND = 'rj';
const HELP_MSG = "Use `rj` or `rj all` to randomly select a job from the whole job pool.\nUse `rj t` to select a job from tanks. Similarily, use `rj h` or `rj d` for healer or dps."

let raw_job_data = fs.readFileSync('jobs.json');
let jobs = JSON.parse(raw_job_data);

client.once('ready', () => {
	console.log('Ready!');
});

client.login(process.env['TOKEN']);

client.on('message', message => main(message));

function main(message) {
    if(message.author.bot || !message.content.startsWith(COMMAND)) return;

    var args = message.content.split(' ');
    var ch = message.channel;

    // handle arguments
    if(args[1] == 'tank' || args[1] == 't') {
        var job = select_from_tanks();
    }
    else if(args[1] == 'healer' || args[1] == 'h') {
        var job = select_from_healers();
    }
    else if(args[1] == 'dps' || args[1] == 'd') {
        var job = select_from_dps();
    }
    else if(args[1] == 'all' || args[1] == 'a' || args.length == 1) {
        var job = select_from_all();
    }
    else if(args[1] == 'help' || args[1] == 'h') {
        ch.send(HELP_MSG);
        return;
    }
    else {
        ch.send("Sorry, I don't understand your command. Please use `rj help` if needed.");
        return;
    }

    var response = "Hi " + message.author.username + ", today you will do your daily roulette using: " + job;
    ch.send(response);
};

function get_tanks() {
    return jobs.tank;
};

function get_healers() {
    return jobs.healer;
};

function get_dps() {
    return jobs.dps.melee.concat(jobs.dps.ranged, jobs.dps.caster);
};

function get_all() {
    return get_tanks().concat(get_healers(), get_dps());
}

function select_from_all() {
    var jobs = get_all();
    return jobs[random(jobs.length)];
}

function select_from_tanks() {
    var jobs = get_tanks();
    return jobs[random(jobs.length)];
}

function select_from_healers() {
    var jobs = get_healers();
    return jobs[random(jobs.length)];
}

function select_from_dps() {
    var jobs = get_dps();
    return jobs[random(jobs.length)];
}

function random(max_n) {
    return Math.floor(Math.random() * (max_n));
}