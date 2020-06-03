# backend-2020

## Intro
This project was created for the course: Backend and Project Tech. The idea was to create a single feature from a dating app. The feature I picked is a chat feature with the abillity to send gifs.

---

## Table of Contents
1. Installation Guide
2. Job Story & Feature
3. 
---

## Installation Guide
`git clone https://github.com/jesseDijkman1/dating-app-feature.git`
`cd dating-app-feature`
`npm install`

You'll need to setup a `.env` file with these values:
```env
DB_CONNECT=[MONGO DATABASE URL]
GIPHY_API_KEY=[API KEY FROM GIPHY.COM]
```

---

## Job Story & Feature
**The Job Story**
Before coding, I had to write down a job story, that would become a feature. The job story I wrote is: 

> When I'm on the bus with my phone in one hand, I want to be able to send GIF's or images so I can talk with one hand

So when you don't have both hands available, you can still look up a funny GIF and send that instead of a long message. 

**The Feature**
Simple put, the feature is a chat with the possibility to send GIF's, which you can look up using a search bar. A dating app that has this feature is [Tinder](https://tinder.com/). To make this I will use the [Giphy](https://giphy.com/) API.

---

## Goals
Before I started I knew I wanted to make it accessible. This means the feature can be used without JavaScript. The plan was to progressively enhance the code, so it would later on support `IO` (input/output). 

---

## Process
I started with a login and register page (which I should't have, because that's not my feature). I waisted some time on this, and also on the matching feature. I started way too late with the actual chat feature, but managed to get it done.

I started with the basic HTML. Every page (feature) had been tested before I added the styling. I started with the core and added a sugar coating of CSS later in the process.


