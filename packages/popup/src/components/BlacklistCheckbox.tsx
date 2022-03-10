import { localStorageKeys } from '@tab-master/common';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  input[type='checkbox'] {
    --active: hsl(142.7,46.05%,52.745%);
    --active-inner: #fff;
    --focus: 2px #27fe794c;
    --border: #BBC1E1;
    --border-hover: hsl(142.7,46.05%,52.745%);
    --background: #fff;
    --disabled: #F6F8FF;
    --disabled-inner: #E1E6F9;
    -webkit-appearance: none;
    -moz-appearance: none;
    height: 25px;
    width: 25px;
    outline: none;
    display: inline-block;
    vertical-align: top;
    position: relative;
    margin: 0;
    cursor: pointer;
    border: 1px solid var(--bc, var(--border));
    background: var(--b, var(--background));
    transition: background .3s, border-color .3s, box-shadow .2s;
    border-radius: 7px;

    :after {
      content: '';
      display: block;
      left: 0;
      top: 0;
      position: absolute;
      transition: transform var(--d-t, .3s) var(--d-t-e, ease), opacity var(--d-o, .2s);
      opacity: var(--o, 0);
      width: 7px;
      height: 10px;
      border: 2px solid var(--active-inner);
      border-top: 0;
      border-left: 0;
      left: 7px;
      top: 4px;
      transform: rotate(var(--r, 20deg));
    }

    :checked {
      --b: var(--active);
      --bc: var(--active);
      --d-o: .3s;
      --d-t: .6s;
      --d-t-e: cubic-bezier(.2, .85, .32, 1.2);
      --o: 1;
      --r: 43deg;
    }
    :disabled {
      --b: var(--disabled);
      cursor: not-allowed;
      opacity: .9;
      :checked {
        --b: var(--disabled-inner);
        --bc: var(--border);
      }
      & + label {
        cursor: not-allowed;
      }
    }
    :hover {
      :not(:checked) {
        :not(:disabled) {
          --bc: var(--border-hover);
        }
      }
    }
    :focus {
      box-shadow: 0 0 0 var(--focus);
    }
  }
`;

const Label = styled.label<{ isChecked: boolean }>`
  font-size: 14px;
  line-height: 21px;
  display: inline-block;
  vertical-align: top;
  cursor: pointer;
  margin-left: 4px;
  color: var(--text-color);
  margin-right: 0.9rem;
  letter-spacing: 1px;
  text-decoration: ${({ isChecked }) => (isChecked ? 'line-through' : 'unset')};
`;

type Props = {
  isChecked: (domain: string) => boolean | boolean;
  onCheck: (checked: boolean, domain: string) => void;
}

function Checkbox({ isChecked, onCheck }: Props) {
  const [domain, setDomain] = useState('');

  useEffect(() => {
    const storageChangeListener = (
      changes: {
      [key: string]: browser.storage.StorageChange;
      },
      areaName: string,
    ) => {
      if (areaName !== 'local') return;
      const newDomain = changes[localStorageKeys.CURRENT_DOMAIN];
      if (newDomain) setDomain(newDomain.newValue);
    };
    browser.storage.onChanged.addListener(storageChangeListener);

    const fetchDomain = async () => {
      const storage = await browser.storage.local.get();
      setDomain(storage[localStorageKeys.CURRENT_DOMAIN]);
    };
    fetchDomain();

    return () => {
      browser.storage.onChanged.removeListener(storageChangeListener);
    };
  }, []);

  const checked = typeof isChecked === 'boolean' ? isChecked : isChecked(domain);
  return (
    <Container>
      <Label htmlFor="c2" isChecked={checked}>
        {domain}
      </Label>
      <input id="c2" type="checkbox" onChange={(e) => onCheck(e.target.checked, domain)} checked={checked} />
    </Container>
  );
}

export default Checkbox;
