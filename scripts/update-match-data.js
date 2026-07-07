#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const API_URL = process.env.ZAFRONIX_API_URL || 'https://api.zafronix.com/fifa/worldcup/v1/tournaments';

async function fetchMatchData() {
  console.log(`Fetching match data from ${API_URL}...`);
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch:', error.message);
    throw error;
  }
}

function extractTeamData(apiData) {
  if (!apiData.tournaments?.[0]?.matches) {
    console.warn('No matches found');
    return [];
  }
  
  const teamsMap = new Map();
  apiData.tournaments[0].matches.forEach(match => {
    ['team1', 'team2'].forEach(team => {
      const code = match[`${team}_code`];
      const name = match[team];
      const opponent = team === 'team1' ? 'team2' : 'team1';
      
      if (!teamsMap.has(code)) {
        teamsMap.set(code, { team_code: code, team: name, route: [] });
      }
      
      teamsMap.get(code).route.push({
        match_id: match.id,
        stadium: match.stadium,
        city: match.city,
        date: match.date,
        score_for: match[`${team}_score`],
        score_against: match[`${opponent}_score`],
        weather: match.weather
      });
    });
  });
  
  return Array.from(teamsMap.values());
}

function updateHtml(htmlContent, newTeamData) {
  const regex = /const teams=\[(.*?)\];/s;
  const match = htmlContent.match(regex);
  if (!match) throw new Error('Could not find teams array in index.html');
  return htmlContent.replace(regex, `const teams=${JSON.stringify(newTeamData)};`);
}

async function main() {
  try {
    const apiData = await fetchMatchData();
    const teamData = extractTeamData(apiData);
    const htmlPath = path.join(__dirname, '..', 'index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const updatedHtml = updateHtml(htmlContent, teamData);
    fs.writeFileSync(htmlPath, updatedHtml, 'utf-8');
    console.log('Successfully updated index.html');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
