// Answer key for FBA429 Akintunde Qs.pdf
// Generated from color analysis where red text (RGB 201,33,30) indicates correct answer

export const FBA429_ANSWER_KEY: { [key: string]: string } = {
  "The importance of foreign direct investment": "C",
  "most likely reason that firms globalize": "C",
  "distinctive strength that is central": "A",
  "primary reason that firms acquire resources": "D",
  "likely reason that firms globalize": "B",
  "Pepsi's reason for following Coca-Cola": "C",
  "not considered a dominant institution": "B",
  "Capital supplied by residents": "A",
  "boundaryless economy": "D",
  "International business originally consisted": "B",
  "contractual arrangement in which a firm": "C",
  "Licensing usually involves": "B",
  "Walt Disney permits": "B",
  "firm in one country agreeing to operate": "C",
  "engages in cross-border commercial": "C",
  "identify firms that have extensive": "B",
  "International Red Cross": "C",
  "common activity of MNCs": "B",
  "Toyota, ExxonMobil, General Electric": "A",
  "International nonprofit organizations": "B",
  "integration of markets, nation-states": "D",
  "city would want to host the Olympic": "B",
  "international business transaction": "D",
  "Internet has helped small businesses": "D",
  "CAGE Model": "C",
  "Individuals should most likely study": "C",
  "triggered the increase of small businesses": "A",
  "Just-in-time systems were created": "B",
  "Just-in-time systems are used": "B",
  "Sony's suppliers deliver": "B",
  "buying of products made in other": "B",
  "Shoprite purchases kalamata": "B",
  "British term for the trading of tangible": "A",
  "British term for the trading of intangible": "B",
  "international business activity called": "A",
  "investments made for the purpose": "C",
  "location of a parent company": "B",
  "headquartered in Taiwan": "B",
  "Ford Motor Company is based": "D",
  "where a company operates but is not": "A",
  "Siemens is headquartered": "B",
  "purchases of foreign financial assets": "C",
  "Nigeria pension fund purchases": "B",
  "Kraft purchased all": "B",
  "McDonald's has licensed": "C",
  "IMF head office": "D",
  "IMF was established": "B",
  "Objectives of IMF include": "A",
  "foreign exchange market": "D",
  "Promotion of international trade": "D",
  "currency market": "A",
  "only participants in forex": "B",
  "characteristic of FEM": "C",
  "Exchange rates between": "B",
  "One of these statements is true": "A",
  "influence exchange rate EXCEPT": "D",
  "World Bank is": "C",
  "major methods of entering": "A",
  "not a non-equity mode": "C",
  "businesses go international": "C",
  "Forms of joint venture": "D",
  "biggest investment when entering": "A",
  "Equity-based mode": "A",
  "Indirect exporting involves": "D",
  "types of counter trade EXCEPT": "C"
};

export function findAnswerForQuestion(questionText: string): string | null {
  // Clean the question text
  const cleanText = questionText.trim().toLowerCase();
  
  // Try to find a matching key
  for (const [key, answer] of Object.entries(FBA429_ANSWER_KEY)) {
    if (cleanText.includes(key.toLowerCase())) {
      return answer;
    }
  }
  
  return null;
}
