import React, { useEffect, useState } from 'react';
import './App.css';
import outputData from '../output.json';

interface CharacterData {
  character: string;
  imageUrl: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<CharacterData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const parsedData = outputData.map(({ text, imageUrl }: { text: string; imageUrl: string }) => ({
        character: text,
        imageUrl,
      }));
      setData(parsedData);
    };

    loadData();
  }, []);

  return (
    <div className="app">
      <h3>Chinese Character Poster</h3>
      <div className="grid">
        {data.map(({ character, imageUrl }) => (
          <div className="cell" key={character}>
            <div className="character">{character}</div>
            <img
              src={imageUrl || ''}
              alt={`Stroke order for ${character}`}
              className="stroke-order"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
