export interface Puzzle {
  [key: string]: any;
  title: string,
  solvePart1(input: string): string | number;
  solvePart2(input: string): string | number;
  answers?: string;
  showInput?: boolean;
}

const isNumber = (char: unknown): boolean => {
  return !isNaN(Number(char));
}

export const puzzles: Puzzle[] = [
  {
    title: 'Trebuchet?!',
    buildNumber(tens: string, units: string): number {
      return parseInt(`${tens}${units}`)
    },
    solvePart1(input: string) {
      return input.split('\n').reduce((acc, line) => acc + this.buildNumber(
        line.split('').find(char => isNumber(char)) ?? 0,
        line.split('').reverse().find(char => isNumber(char)) ?? 0
      ), 0);
    },
    solvePart2(input: string) {
      const digits = ['zero','one','two','three','four','five','six','seven','eight','nine'];
      const reverse = (s: string) => s.split('').reverse().join('');
      const findDigit = (line: string, digits: string[]) => {
        let char: string | null = null;
        let charAcc = '';
        do {
          char = line.at(0) ?? null;
          line = line.substring(1);
          if (char) {
            if (isNumber(char)) return char;
            charAcc += char;
            const digit = digits.find(digit => charAcc.includes(digit));
            if (digit) return digits.indexOf(digit).toString();
          }
        } while (char);
        return '0';
      };
      return input.split('\n')
        .reduce((numAcc, line) => numAcc + this.buildNumber(
          findDigit(line, digits),
          findDigit(reverse(line), digits.map(digit => reverse(digit)))
        ), 0);
    }
  },
  {
    title: 'Cube Conundrum',
    getCubes(line: string) {
      const getColor = (rawColor: string) => rawColor?.includes(',') || rawColor?.includes(';')
        ? rawColor.substring(0, rawColor.length - 1)
        : rawColor
      const cubes: { nb: number; color: string; }[] = [];
      const rawCubes = line.substring(line.indexOf(':') + 2).split(' ');
      for (let i = 0; i < rawCubes.length; i++) {
        cubes.push({ nb: parseInt(rawCubes[i]), color: getColor(rawCubes[++i]) });
      }
      return cubes;
    },
    solvePart1(input: string) {
      const checkFeasibility = (cubes: { nb: number; color: string; }[]): boolean => !cubes.some(cube =>
        cube.color === 'red' && cube.nb > 12 ||
        cube.color === 'green' && cube.nb > 13 ||
        cube.color === 'blue' && cube.nb > 14
      )
      return input.split('\n').reduce((acc, line, index) => {
        return acc + (checkFeasibility(this.getCubes(line)) ? index + 1 : 0);
      }, 0);
    },
    solvePart2(input: string) {
      return input.split('\n').reduce((acc, line) => {
        const cubes: { nb: number; color: string; }[] = this.getCubes(line);
        const power = cubes.reduce((powerAcc, cube) => ({
          r: cube.color === 'red' && cube.nb > powerAcc.r ? cube.nb : powerAcc.r,
          g: cube.color === 'green' && cube.nb > powerAcc.g ? cube.nb : powerAcc.g,
          b: cube.color === 'blue' && cube.nb > powerAcc.b ? cube.nb : powerAcc.b,
        }), {r: 0, g: 0, b: 0});
        return acc + (power.r * power.g * power.b);
      }, 0);
    }
  },
  {
    title: 'Gear Ratios',
    grid: [],
    solvePart1(input: string) {
      this.grid = input.split('\n').map(rawLine => rawLine.split(''));
      const parts: { value: number, length: number, x: number, y: number }[] = [];
      let numberAcc: string | null = null;
      this.grid.forEach((line: string[], y: number) => {
        line.forEach((char, x) => {
          if (isNumber(char)) {
            numberAcc ? numberAcc += char : numberAcc = char;
          } else {
            if (numberAcc) {
              parts.push({ value: parseInt(numberAcc), length: numberAcc.length, x, y });
              numberAcc = null;
            }
          }
        })
        if (numberAcc) {
          parts.push({ value: parseInt(numberAcc), length: numberAcc.length, x: line.length, y });
          numberAcc = null;
        }
      });
      return parts.reduce((acc, part) => {
        const adjacent: string[] = [];
        const startX = part.x - part.length - 1;
        if (startX >= 0) {
          if (part.y > 0) adjacent.push(this.grid[part.y - 1][startX]);
          adjacent.push(this.grid[part.y][startX]);
          if (part.y < this.grid.length - 1) adjacent.push(this.grid[part.y + 1][startX]);
        }
        for(let i = part.length; i > 0; i--) {
          const posX = part.x - i;
          if (part.y > 0) adjacent.push(this.grid[part.y - 1][posX]);
          if (part.y < this.grid.length - 1) adjacent.push(this.grid[part.y + 1][posX]);
        }
        if (part.x < this.grid[0].length - 1) {
          if (part.y > 0) adjacent.push(this.grid[part.y - 1][part.x]);
          adjacent.push(this.grid[part.y][part.x]);
          if (part.y < this.grid.length - 1) adjacent.push(this.grid[part.y + 1][part.x]);
        }
        if (adjacent.some(adj => adj !== '.' && !isNumber(adj))) {
          acc += part.value;
        }
        return acc
      }, 0);
    },
    solvePart2(_: string) {
      interface Gear { part1: { x: number, y: number }, part2: { x: number, y: number } }
      const gears: Gear[] = this.grid.reduce((gearsAcc: Gear[], line: string[], y: number) => {
        line.forEach((char, x) => {
          if (char === '*') {
            const above: string[] = [];
            const level: string[] = [];
            const below: string[] = [];
            if (x > 0) {
              const startX = x - 1;
              if (y > 0) above.push(this.grid[y - 1][startX]);
              level.push(this.grid[y][startX]);
              if (y < this.grid.length - 1) below.push(this.grid[y + 1][startX]);
            }
            if (y > 0) above.push(this.grid[y - 1][x]);
            if (y < this.grid.length - 1) below.push(this.grid[y + 1][x]);
            if (x < this.grid[0].length - 1) {
              const endX = x + 1;
              if (y > 0) above.push(this.grid[y - 1][endX]);
              level.push(this.grid[y][endX]);
              if (y < this.grid.length - 1) below.push(this.grid[y + 1][endX]);
            }
            const parts: {x: number, y: number}[] = [];
            above.forEach((char, i) => {
              if (isNumber(char) && (i >= 2 || !isNumber(above[i+1]))) {
                parts.push({x: x - 1 + i, y: y - 1})
              }
            });
            level.forEach((char, i) => {
              if (isNumber(char)) parts.push({x: x -1 + (i * 2), y});
            });
            below.forEach((char, i) => {
              if (isNumber(char) && (i >= 2 || !isNumber(below[i+1]))) {
                parts.push({x: x - 1 + i, y: y + 1})
              }
            });
            if (parts.length === 2) gearsAcc.push({ part1: parts[0], part2: parts[1] });
          }
        });
        return gearsAcc;
      }, []);
      return gears.reduce((acc, gear) => {
        let part1 = '';
        let offsetX = gear.part1.x;
        while (isNumber(this.grid[gear.part1.y][--offsetX])) {}
        while (isNumber(this.grid[gear.part1.y][++offsetX])) {
          part1 += this.grid[gear.part1.y][offsetX];
        }
        let part2 = '';
        offsetX = gear.part2.x;
        while (isNumber(this.grid[gear.part2.y][--offsetX])) {}
        while (isNumber(this.grid[gear.part2.y][++offsetX])) {
          part2 += this.grid[gear.part2.y][offsetX];
        }
        return acc + (parseInt(part1) * parseInt(part2));
      }, 0);
    }
  },
  {
    title: 'Scratchcards',
    cards: [],
    scratchCard(card: [string[],string[]]): number {
      const numbers = card[0];
      const winningNumbers = card[1];
      return numbers.reduce((matchAcc, nb) => matchAcc + (winningNumbers.includes(nb) ? 1 : 0), 0);
    },
    solvePart1(input: string) {
      this.cards = input.split('\n').map(card =>
        card.substring(card.indexOf(':') + 2).split(' | ').map(line =>
          line.split(' ').filter(char => char)));
      return this.cards.reduce((acc: number, card: [string[],string[]]) => {
        const matches = this.scratchCard(card);
        let points = 0;
        if (matches > 0) {
          points = 1;
          for (let i = 1; i < matches; i++) {
            points *= 2;
          }
        }
        return acc + points;
      }, 0);
    },
    solvePart2(_: string) {
      interface CardPower { power: number, card: [string[], string[]] }
      const cardPowers: CardPower[] = this.cards.map((card: [string[],string[]]) => ({ power: 1, card }));
      return cardPowers.reduce((acc, cardPower, i) => {
        const matches = this.scratchCard(cardPower.card);
        for (let c = 1; c <= cardPower.power; c++) {
          for (let m = 1; m <= matches; m++) cardPowers[i + m].power++;
        }
        return acc + cardPower.power;
      }, 0);
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  },
  {
    title: '',
    solvePart1(_: string) {
      return 'TODO'
    },
    solvePart2(_: string) {
      return 'TODO'
    }
  }
]
