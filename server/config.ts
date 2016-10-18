import { Play } from './play';

export class AppConfig {
    public Mongoose: any;
    public Play: Play = new Play();

    constructor() {
    }
}

var config: AppConfig = new AppConfig();
module.exports = config;
