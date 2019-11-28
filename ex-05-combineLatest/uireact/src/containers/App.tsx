import React, { useRef, useEffect, useState, useMemo } from 'react';
import useFetchedResults from '../hooks/useFetchedResults';
import useFormData from '../hooks/useFormData';

export default () => {
  const options = useMemo(() => ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'J'], []);

  const [{ name, category, inStock }, handler] = useFormData({
    name: '',
    category: options[0],
    inStock: false,
  });

  const results = useFetchedResults([name, category, inStock]);

  return (
    <>
      <div>
        <label htmlFor="name">
          Search
          <input name="name" value={name} onChange={evt => handler('name', evt.target.value)} />
        </label>
        <label htmlFor="in-stock">
          In stock?
          <input
            name="in-stock"
            type="checkbox"
            checked={inStock}
            onChange={evt => handler('inStock', evt.target.checked)}
          />
        </label>
        <label htmlFor="category">
          <select
            name="category"
            value={category}
            onChange={evt => handler('category', evt.target.value)}
          >
            {options.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ul>
        {results.map((r: any, ix: any) => (
          <li key={ix}>{JSON.stringify(r)}</li>
        ))}
      </ul>
    </>
  );
};
