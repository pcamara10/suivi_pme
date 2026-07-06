import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  LayoutDashboard, ShoppingCart, Wallet, Package, TrendingUp, AlertTriangle,
  Plus, Trash2, LogOut, Copy, Menu, X, Users, Truck, FileText, Settings, Save, DollarSign, CreditCard, Calendar
} from "lucide-react";
import {
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { supabase } from "./supabaseClient";
import AuthScreen from "./AuthScreen";
import logoSuiviPME from "./assets/logo-suivi-pme.png";

const INK = "#152238";
const TEAL = "#1E7F6E";
const MUSTARD = "#E0913C";
const CORAL = "#C4432B";
const BG = "#F6F4EF";
const CARD = "#FFFFFF";
const LINE = "#15223814";
const CATEGORIES_DEPENSES = ["Loyer boutique", "Transport / livraison", "Électricité", "Salaires", "Fournitures", "Autre"];
const CAT_COLORS = [TEAL, MUSTARD, CORAL, INK, "#7A9E9F", "#B8A488"];

const THEME_OPTIONS = {
  emeraude: {
    nom: "Émeraude Premium",
    description: "Équilibre moderne, idéal par défaut.",
    accent: "#0F766E",
    secondary: "#14B8A6",
    sidebar: "#0F172A",
    bg: "#F8FAFC",
    card: "#FFFFFF",
    soft: "#ECFDF5",
    text: "#111827",
    muted: "#64748B",
    border: "#E2E8F0"
  },
  bleu: {
    nom: "Bleu Corporate",
    description: "Sobre et institutionnel pour la gestion.",
    accent: "#2563EB",
    secondary: "#60A5FA",
    sidebar: "#0B1F3A",
    bg: "#F5F7FA",
    card: "#FFFFFF",
    soft: "#DBEAFE",
    text: "#111827",
    muted: "#64748B",
    border: "#D7E3F7"
  },
  dark: {
    nom: "Dark Pro",
    description: "Mode nuit premium et confortable.",
    accent: "#10B981",
    secondary: "#38BDF8",
    sidebar: "#020617",
    bg: "#0F172A",
    card: "#111827",
    soft: "#1E293B",
    text: "#F9FAFB",
    muted: "#CBD5E1",
    border: "#334155"
  },
  indigo: {
    nom: "Indigo Premium",
    description: "Style SaaS moderne et élégant.",
    accent: "#6366F1",
    secondary: "#A78BFA",
    sidebar: "#312E81",
    bg: "#F8FAFC",
    card: "#FFFFFF",
    soft: "#EEF2FF",
    text: "#111827",
    muted: "#64748B",
    border: "#DDD6FE"
  },
  orange: {
    nom: "Orange Business",
    description: "Adapté aux boutiques et commerces.",
    accent: "#EA580C",
    secondary: "#FB923C",
    sidebar: "#7C2D12",
    bg: "#FFF7ED",
    card: "#FFFFFF",
    soft: "#FFEDD5",
    text: "#111827",
    muted: "#6B7280",
    border: "#FED7AA"
  },
  light: {
    nom: "Light Minimal",
    description: "Très clair, simple et discret.",
    accent: "#0F766E",
    secondary: "#94A3B8",
    sidebar: "#FFFFFF",
    bg: "#F8FAFC",
    card: "#FFFFFF",
    soft: "#F1F5F9",
    text: "#111827",
    muted: "#64748B",
    border: "#E5E7EB"
  }
};

const OM_LOGO_DATA = "data:image/png;base64,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";
const WAVE_LOGO_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAb8AAAG/CAMAAAD/zSlAAAAA/FBMVEVK0voBAgL+/v70fyBTz/X5ewTPmX9M1/9N2v/4gSFO3P/19fUAAAP7gyFO3v9Jz/Z8QBBAt9clbYLv7+94eHja2tpNTU02NjY6psU+stRlZWXl5eUMIykqepENKjM0l7QaTVxEwuYvLy8tgpshISFdXV3BwcFERETMzMyWlpaFhYXZcRzqeh+VTRMiZHcUOUS0tLSlpaXCZRkGFBgVFRVqNw4pFQUyGgcXQ1ClVRUfWWr/dgBVLApAIQizXRdfMQxKJgkdDgTdj2KIRxEAKDi3gmbKYwBheICIvtHpjVD3hz3HnIt2wdloyOjWlHHuhkSzpZuWtL6/o5ODVDbddIK1AAAXLUlEQVR4nO2deVvi2LbGDXT1DgqCWigqgjii4ATOVU7tOff2VKe7z/3+3+UmDDKEkLX2QCL7/f3T9VTnScr9uoc17oUFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGES4yz6LwmOx80dXxP1vAiSEcN38SnV/9fG+Uu5SuV/dqW7WhCsgYpLx5MnXSvvnFWcyu6ullVoeIiYTsTBNux7t3dXqSh6LadIQi/nS6m57ung9Ls73a64b978YDBBubadCE69DtvxYwjKaELxNr7RL1+5jJd2vLUDC+BG1qoR6HQV3VqBgzIiF6m5WTj6PymptMe6fwGaEu3nP2PYmKbifx0kmLsTKo5J4HcpVLKKxIPLVsrp8HuebEHD2uJvnWtRz/EUUU3DWuNUITwuLR+yCM0XkNex8w7RLmIGzQ6zc65XPN+fzUHBGuKUL3fJ5nEPA2bC8r+fcOc4uNsFZIPaNqOdxsYIZaJz8jin5PAFhCRpnR81hFiUg/KFGWTS2ePYErGEPNIhp+RznvoYl1Bjmji4DdiGgMUpmDIdRzvNx/5hziqiZMNuDrC7H/ZPOKbORz3FKOIQawNUWL4qiDDNQP6I6K/lwhjGA2NQZ74tiP+4fd+7Iz2z17IAVVC+zsPyGKcOI0ImozcLyG2YHE1Ajy5rTJaLBGVQj7uas5XOc87h/6HlCe7oLgSomoCZE1WTML4xHHGE0UZv57tcBKYV6EKVY5HMu4AbVQl6yvk8ZTEAdxDX9HGcX+mlg9rZfnzZsQHVELS754ITRwbLBfM8okMykTj4O270PbHhV3JnkLIWxChteERHj8uk4lVrcP/9npxaX8delFPfP/8kRpThcnwPOsQEqMcuspUm0oZ8S5LSXjcPDY6ooe+tb6wfEZ2FBKFEjZZ1dnxaXPLZPKKoc1te8Z9eOaHLvIxlbAUEKvB8WUz3WvkY9u3fUfzZFUnsX+ingUra/rbUPSVJLJ9OfPa4Pnk1d7kW/vBz3EHxqFgm+68Pt1DBbUx+ujzx7dR359jZq4hVwo0tWDo5GJEltT9PkZPTZCLE7VFGQq0D0+H4dkyR1NUXrpbFni9Hv34d+0hBiR9dH4/oVN0IfPh1/NhV9CIUFLw8h9L43PqVSa+GLYkDrVMRxx/G7+sQ9Cp8XN7rqYS8gSeo09Nli4Nl6tH6w4KVZjPa+bAX1C51TG9uBZ6M3QPT0kUdEmw8c/Y5l9CsjC00aQux93fT8ayMGL4sgeD+D+99SqA/tOrj/XUZ+ALW40ojN6NyJg4Am2+uhD18G9CMY8MihkMWl1K2Mu1RSR+HPBhbbpej3o5+PNATzwdNkbFNbmjal6mP6TfHVfHCPHBhJaLlLYxNw6o62PmrtT3HVDKjAgy0JMfg+4lXZnv7siAdt+5Dy+jZymCSh5p5dDmZVPSomezoIFhYJhxefatzj8Emh3xJw2tvXiifREdmto67aa5fUfJl9rJ9SMFoubWydXF5efSUpcrB1enl0dUpaOzugikUOXu7ndXQsfehhxrPOIyKAUsSd+9mnAgNQjhn3zAoF+kmRX41buB6IAEoRW9+CcRBBkmJG7a6j2UcjERlqcevWBw3NpYihad1k7qGfDFr6vmTlb4f/oAwDUALVlrvZsf/K04YBIYGr0rfHF+329abw/v5euPl+pyggUtAkWFQ6ft4WHlqNZsYj3Wy0nt9fHYWZWMICykcoVL4X+tr59EQ8u5WWEAaEBHlJ7W5fnjO5nnQDMplcrlG4e5N6JQwIPnJ9z95ezhq5XHoyuVzzufAk8VZEIPiQSm+H8ZbG17NWMzc+80ZmYS7TeHhh64caFj4uu/HSy0MzHVg3gxJmmq33W96bL+DBZkOoXRni7emsmZs69Ua2wvTzC0fCCjzYbFxq9CHr3H5/b2WI4vXwtsKHmyfqcbQMA4JPdPJLZ/RfPUOvGXpkmTILc+nG89n3N5KAlqcwCcH++Sk3Hj29Pzw3mmnm1BuR0LPtH96jDzQW6+dJl9/c3Kwt8DSk1K7cNnKZ6APLdAm9zbAZrd+qqdFJOmJhZb/rB6vsbOYZCpLMh9tnNfV8cg2Cd9TWu1hEbWdoGq0yKglItSvO7QN/4xuTr0Ux6C1thL24MnqIvKff7Ezsu/t2piZg7pkUm6hYGYEQ1cAeRu5mlKdGj97T8mtoJndG+0jbRgNwogdlxyWNhKD3TX5pyAqYaxaoFqB9NSwiP3kF3CFtJWKFGv3LOq8tOQMi16B7Qu0zIELk885yFAFFiXFd+N2DhBWRyT3c0cOB1hkQU84flMMc88rGQpp7jMmlC5wP2GZAuFNz36NPc7zalWzWabGOMbnm8xsrFm9ZDUtU7lh0Txx29KjQIC+imUzrhvn2tlVNDNyoyr1yVFMcct/5Plnn7qxBOsfkco33W3YijE0GhKhFFz6vTrcjpK5duTubHn3vq3cnkdRrUxct0uR5nOoNlald8UUpNNLhLu1OvOFGLgnNohQ04tljWmNN2r0BQTxlbp4bzUwwFO//VbP18F3uvd6vmzUpaCJPvPHtYjPcmSZd+5D1EwjfuxoO4U285/eXN/kcXnsuo14kl82WS2G/1Gql71nn7e71pnD23Go1Go1W6/nh5uX1Tq0SomzL/sfqGhHmVhSqpdPjJ5Ssch2SNREk1sl/Z/IpRql2ZYisr1tWQwmSNTUsgnnf6fnCpHEh3Nsxa2y5x4PrONnNTxoYIxIoYcdFZJS0sTEuJmRVyNauGOTRjgOoxMExmN1MuLdj5uzGMJgxIOP3KlfHfrfZtSszwIo2vHJFXwHv1HKsl4ZPZtIyP3dIT5zVkWPoclI6Lw1hRQ3EovTAj2RVLDOSJ2ZF2wYDIi8/8CNZFexD7Ayw4CJAsanQc+B+s78JiprCa4xhQQqT2rmx0t9heI13Z4UF93jwa55HqXZrlGi1D7Nm1wIDgpu1Ms5+x52t+mtgBgsMCPWOq6v+KUao/hoYoTz/+hHylqLopMVoih5pZu5T0ISOjrmVmqvh18AEc1/DQi86mUa5pOU1+pn7ixz16OdUzpNovltwkaMm/ZLK/dzrtznX+lXm3QCc7/mXdeZev4QeHHUx9yloUlUnn4e5jyCxq74+Fzvzrp9y2nSy2Z33FMJkBg60UZn3FMJkBu70MffrZyID5/rgNOD7lJCb5n5O5t6AWExk5FUbc29AyNY9fxLm3oCgdK3+xJzPvX6ql74lm924h9c4YmWeT6AW3OMx1y60yvynMKl1jkg4NtSwkBsfm+f6YG9jY2PvQNsLbahhSUjt5cbW6cnlUb1YLNYvr06+Hut5qxVteOP3weydHhXXUkMsFetXOiS0oIYlfht+43JtKRVkrb6l/Gor2vDGWr5wvVWfoF2P7a+Ke6Ed93jEmAZzeBWunk/9q9LrLahhWeD3YNLG9cn2dPm8nfByQ+ED5bmvgehAvPxGNwfFKPU6i6jKNmhJG156D0mNnFLU87mS3wXnvgaii1iY+Ra4F7HzDVOXtiV24h7ZGSFWZizg9RFdvlSqKCugFQaEz6xz6adYDRMFPJT7zNzXsHww02T6PdLJZZg1uVNMed5rIAa4Cs18mGwwZ5+CgCtxD+vscGe1hB5IyOcJuC7zrc24R3WGzGoPZB1dBhRlLHlLDMAusxHwUk4+z4yQEHB13nPoR3B1dKSI4HRSsIHGJf9r9/NewzKK+V4gW2vROoVywv5c2S79jC+h15Ee66nwzzA27X8+hgWU3vy6bLNdofYYgD2M7oFf1eST2ALnvoYlgEE78Fht9fRY4gZ0LUhBG8eYM/tacfX0Ke7xvmlBDUsAU3vglrzpMIB5Bn20UD9DeyDfaz0R3hn0wrr9z8fIHniiRb5UnfXRihUpaAEMCHitY/X0YR1hyvYdQDvo3wMZCRPTqV8zvtq2IwUtiO498FDFcTYK6whjwT0ek9G8hGqwHfqwIkk7ls4/zQIeKpvuQ3B2wPO4hzE+dO6B2nY/nyLjw9akoE1A3ww81rf7+TDS0eyoYQnBrWlKatI6/VgTsGKpAdHF1eQL1WX79aFPQEtqWMLQswcqx43GoceRslalMAXRIqAez+cQ23QvqCU1LKFoMOS1BB5Godvwc3+PRxTqe6BG271PnRwHtNmA6KK6hG5oXz5TqSXyCcaKm+CnoyjgV/3LJ2MBbUM/tT1QR9pEkDVyFMKmGogwVDwxxwaWzxQ5Dp+d/4scKSgsoVtG5EtdUb9vRRetSOQF1Ow767NN/b5dNSyhSO+Bel3XA6gm/D306yC5B64bko98Am3bGoEfRy6xV1PaWRByIlrc45YYpDptSVVLU9imdhWBAdhnmd/tdcOE8d5h6ZT4T7CwBiKMZXanLYV62yioFsS+ZUWcUxB57hnGkPXgc0T0YZ9Dvw9EiSfftbHtL5UqEi0Iy4rgp8O8smXdjPOsCzGPsAIHzADBM+ONxB76EC1Ai7poEeBNQGPWn88RLQbRtjoFLQCnUZqZ2FGfIq2dgQ33eDBYZBiBewaPLx7EQghra1hCoOu3rrPsIQixKeEq9BuG0S770Kh8KaIH5jHuEUsWjCtbDMVu+xDTeJGCNgrdCWP0+Emug7i34h4POnnyhRFGj5+p1BLtX1FBCswI9FsfTXpffGgGhOU1LAHECtEEvDaVO9GH5gG1vYZlHFEjXhp4YFg+qgfUlns8qFCvPd4zrR8xBGh9Dcs4xAOMYfOBbkDAgz0C1YetvW5zHGIO0wX0G8GttknjZjD43oVoAJYtuseDAjURLSH6oQZiDKp+kld10KE2xIYBMQJVP7PRoxQ9B9TeLloToepn2v1C7mOwCv2GESXa+cVs9M9jjVhGfR/3iCUL4vnTuPuMfK1cGwb8MC7N/tPWcjdcP6IDDUXwIxDtd/P6ke+DQAraMHlaBsUM9CPXsKCIc4j8I2nQDpKjH2pYhqBedryXHP1QwzIENX6bIP0usH4OoBYhmavdZOtXgQExgJr/kqD517a5jXKAz6cfIhDDEMO3CbIfYEAMkxz9yFdB7EC/D4jme4L8Z5ZeBBgC0XxPkP8aNSzD5Kl9mBKk3y482B/UssRBS0z8zzPg4cH+gFw/Zj7+Tu2hhRqIAfQeMObzX8ht6FEE/wG9A4Xh8jHWRUhow9tnmVj9kJj8zw6oYemzTG4Depog/VDD0selJZ85M6h/OKLrBwOijyCP2bFp/chN6P0aFmyAHUSePGbG6zfJ7mt7b4IPwGgfYtwByrhIFRGkHouMBnamHTCcm8RRw9KF0X7JeAESQz4YgD1cYvTBx7ABSOz/0mU17oFLCIJxC4RhA4J8BYTPbtwDlxA4/T8NNzCg36LqcQED3kdw7oRfNxsBJEfffZBC2IGln4mrU4eg30LtoA12D5Z+B0YPoGvk6JHjNzGAfj5ik3MJktEGknVi94IeaCLiw9PPaASC4f3s6AcDcIF7CdmhSQ8Mw/vpAweoD7V3QZc9gwcYevIS9BvA08+kB63O8X5Cvx5M/QweYIjNB6HfCMxLOA/NhZBY3hfo14N7iaqxAww99xr6DcGzHwzmEBZpt1cNgP3nI1Z4+hlzYXO3P/hfOrD8Z47BHAqW89pBD6YeXP2MJdEz5XPKiD904MT/fAzFcBmpn10Q/+vBvILaUAyQe/p07qFfB0G8vKOPoRgSL/bgoAK3j0suX+lhxAXDXj6Rv9TDJd8+1sPIJZzs5RP5nz1cxv23XQwsoEVy4S30G4ORP9/jVL8JyAzdemThPutR4w7dgfYFlN735YMKwu896PVjfbSnYde5vk/PfID7pQe9/raP9joyZuaED+pv+3AKWHpoPsFs86cfylc+4B9AdQchuJFbH/QP+WCFPXiafTBs3wvuoB6GG4Hw+KrThOAbD2hfMAy1/+AQBxqjSGussocej5h+AxgV1H002vAy08/ZR//WD+gN0IbQlsi7zUzb7QLvywCxwgwB+qzr0k9q+lXiHrNEIbEBasujoLccHAb3rwxD70A4xLqeHVDC9eJRgvU3BDcHtIsWLyirZcEHuL9xDLYL1GNDwwq6JGM7eMsnTi8jsGPwHTQY8VKHF/TOGkfwXWg+yrn0RanDi3MB58sYrswG6DiKE3CJn/XSAbGjcThN7IZQbAgqd/ZE7/kJkO+AGEUpl1Du7Anf9STy3CzQLgcKW6BEzlmXHRh/Aah3OI4j35FJImepSxuZS0GodxgHBZQsh6BfFTfOLnxnE5DyoflI1rPI5Ex0wfSbBPUS6iBfZQRkV9t+cI/I30SE3AnGkYrlXkpknPWA8TAZSR+MD9uRdiUv3y5s9xCWZaKAXbZ4S6j83ue0q3EPU2JRmIDOIcOMWFOQz3nMY/kMRXoHdJxjcjBpW9pw8Ghj9wtHLozbh+hKO2J2qRtlF/JNQyoM2GeLsIauSbqs++DSqmlIJaIN2LiKOMYsXcqF2z84h+03FVfWCdPjcKo7+2hL3mzoUIbrJQIh64Tpc3wVZgvW1xXVQ8l7NC67GD7IaX1tTMOlteKJRI3ROI8w3SMR/GLOIMenl/Xi9tJSV7r65cmh8tRzcGMjCVFTOsJ8cHB8uPXVY2trfU+HeA4qbmnIBnKNU4F8JBaVjEBZItNv2jD9aIj8yArqD+zb3evNTcHn5ub73RtluNna3XqfuOl94uktKB/OnlTc0sjQPhUeWo1GM51J+zQbrdZD4UmfglnvRbeFs+eW9wmfjPeJRuvh/bX7v/og5ZOOGFpBC/6wZny6o9v9Y7N1FpwisurdtJofLx76ROPsafAcbnvn0EsmfPveyuV6wo2SyeRyrZdbdf3enp69V036RNr7+0bhtjvRsfmxELVdx7kreOpNGtge3vC+36kto283rcy0T2RyjbNXX74qUs5YiJV/FaYPbU/BgspG+NJKR33CV/ANlh8XIf49cd0MKJhuPUXrFDL5HpqTF84xBdP/879xD8en49ffoibGQMGC5ORrUNTrfOL3y7jH41MhFq5yX4jy+cP7zN8Fs8771L11lMy3n39gBSXz0x/fiDOjJ2DrO3fy3T2QlucPvvzyJwSkIX78hzH5OmSa33kz8LZFn3w9Af+CgDR+/MKVzz9jvHAEfGtw5fP32V8hIIEfv/Hl82fgDV3AOwn5PAG/QcBIxE8Ss68jYIO6B2bv2ItnT8C/IGAkP8vJ541u4424eD6zTi5DfPkNe+B0xN+y8vmnUJp+Z3KzryPgf36Ke4SSzT9fZOeGL+AZZQt8UfhC+tt/MQHDET/+kp9+Hs0XwurZUNEv/Q0raDiLfyjJl8607iLUyzoPSvKlc79hBQ1D/PpNaWw93qNW0Jemmn7p3N+YgCHkyT7rMDLN6cGI7Juk6TCkH/wwIYhLxanhj+7DdP1u0srf+PJfJMJMhO/2DJLJTd/9lKefH0z6EfdIJRLxq7p8HRtiCq/qM9w7gmIHnIi052WEpuHp5/Et7pFKJD+0yJeeEo3Pvun5wrd/MAEDiCtl46FD5jnchHjXMv08GxDJaAFcZeOhS6bxGr586tj+fJBMEUDX8pkJX0CfVG33Prkr6DeG+EfP8ukJGGoCFjR9IZ37GfqNIRRdn0OD2wrLqld0fQ748gucoGPkf9Gz/fkbYIgPTT5uO07utz/jHq+EIX78rmtw0+nvkw+gT2qRoyEyv8OCGEX8qU+/TMgB5rs2/dIZHGBGEf/oGlpvdXufKJ8O33WfL3/HPWAJQ6t+IS7Qgr4V+st/4x6whCGu9A1u7tm8fn8ghjSC+PuLPp4vyu326NrZbrf/9X/6vvDtZxgQo/zzsz6uVkrV6v7+zmqfnf1qtbT5q85PQL9RftKJ8PFsyh5+Naj/Fzo/Efd4AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgEfw/FG6yh9EgqUgAAAAASUVORK5CYII=";
const PAYMENT_MODES = [
  { value: "Espèces", label: "Espèces", icon: "💵", color: "#15803D", bg: "#DCFCE7", border: "#86EFAC" },
  { value: "Wave", label: "Wave", icon: "", logo: WAVE_LOGO_DATA, color: "#1D4ED8", bg: "#DBEAFE", border: "#93C5FD" },
  { value: "Orange Money", label: "Orange Money", icon: "", logo: OM_LOGO_DATA, color: "#EA580C", bg: "#FFEDD5", border: "#FDBA74" },
  { value: "Carte bancaire", label: "Carte bancaire", icon: "💳", color: "#6D28D9", bg: "#EDE9FE", border: "#C4B5FD" },
  { value: "Virement", label: "Virement", icon: "🏦", color: "#0F766E", bg: "#CCFBF1", border: "#5EEAD4" },
  { value: "Chèque", label: "Chèque", icon: "🧾", color: "#92400E", bg: "#FEF3C7", border: "#FCD34D" },
  { value: "Crédit", label: "Crédit", icon: "⏳", color: "#BE123C", bg: "#FFE4E6", border: "#FDA4AF" },
  { value: "Autre", label: "Autre", icon: "🔘", color: "#475569", bg: "#F1F5F9", border: "#CBD5E1" }
];
const normalizePaymentMode = (mode) => {
  const m = String(mode || "").trim().toLowerCase();
  if (m.includes("orange")) return "Orange Money";
  if (m.includes("wave")) return "Wave";
  if (m.includes("carte")) return "Carte bancaire";
  if (m.includes("virement")) return "Virement";
  if (m.includes("chèque") || m.includes("cheque")) return "Chèque";
  if (m.includes("crédit") || m.includes("credit")) return "Crédit";
  if (m.includes("esp") || m.includes("cash") || !m) return "Espèces";
  return mode || "Autre";
};
const getPaymentMode = (mode) => PAYMENT_MODES.find((m) => m.value === normalizePaymentMode(mode)) || PAYMENT_MODES.find((m) => m.value === "Autre");
const paymentOptions = (includeCredit = false) => PAYMENT_MODES.filter((m) => includeCredit || m.value !== "Crédit");

const ABONNEMENT_MENSUEL = 25000;
const JOURS_ESSAI_ABONNEMENT = 20;
const JOURS_ALERTE_ABONNEMENT = 5;
const MODULES_ESSAI = ["dashboard","ventes","factures","stocks","clients","parametres","abonnement","messagerie"];
const MODULES_MENSUEL = ["dashboard","ventes","factures","devis","depenses","stocks","achats","clients","fournisseurs","caisse","banque","creances","dettes","utilisateurs","rapports","comptabilite","rh","data_ia","parametres","abonnement","messagerie","exports"];

const fmt = (n) => `${Math.round(Number(n || 0)).toLocaleString("fr-FR").replace(/,/g, " ")} FCFA`;
const today = () => new Date().toISOString().slice(0, 10);
const debutDuMois = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
};

const formatDateFr = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("fr-FR");
};

const factureReference = (vente) => {
  if (!vente) return "";
  if (vente.reference) return vente.reference;
  const annee = (vente.date_vente || today()).slice(0, 4);
  const court = String(vente.id || "").replaceAll("-", "").slice(0, 6).toUpperCase();
  return `FAC-${annee}-${court}`;
};

const factureReferenceGroupe = (vente) => {
  const ref = factureReference(vente);
  return String(ref || "").replace(/-\d+$/, "");
};

const regrouperVentesParFacture = (rows = [], produits = []) => {
  const map = new Map();
  rows.forEach((v) => {
    const ref = factureReferenceGroupe(v);
    const key = `${v.client_id || "sans-client"}-${ref}`;
    if (!map.has(key)) map.set(key, { ...v, id: key, reference: ref, lignes_facture: [] });
    map.get(key).lignes_facture.push(v);
  });

  return Array.from(map.values()).map((g) => {
    const lignes = g.lignes_facture || [];
    const total = lignes.reduce((s, l) => s + Number(l.quantite || 0) * Number(l.prix_unitaire || 0), 0);
    const montantPaye = lignes.reduce((s, l) => s + Number(l.montant_paye || 0), 0);
    const reste = lignes.reduce((s, l) => s + Number(l.reste_a_payer || 0), 0);
    const produitsLabel = lignes.map((l) => {
      const p = produits.find((x) => x.id === l.produit_id);
      return `${p?.nom || "Produit"} x${l.quantite || 0}`;
    }).join(", ");
    const statut = reste <= 0 ? "payée" : (lignes.some((l) => l.statut === "annulée") ? "annulée" : (g.statut || "validée"));
    return {
      ...g,
      reference: factureReferenceGroupe(g),
      lignes_facture: lignes,
      produits_label: produitsLabel,
      produits_count: lignes.length,
      quantite_total: lignes.reduce((s, l) => s + Number(l.quantite || 0), 0),
      total_facture: total,
      quantite: 1,
      prix_unitaire: total,
      montant_paye: montantPaye,
      reste_a_payer: reste,
      statut
    };
  }).sort((a, b) => String(b.date_vente || b.created_at || "").localeCompare(String(a.date_vente || a.created_at || "")));
};

const safeText = (v) =>
  String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");


const codeCourt = (prefix, value) => {
  if (!value) return `${prefix}-------`;
  const compact = String(value).replaceAll("-", "").toUpperCase();
  return `${prefix}-${compact.slice(0, 6)}`;
};

const codeClient = (c) => c?.code_client || codeCourt("CLI", c?.id);
const codeFournisseur = (f) => f?.code_fournisseur || codeCourt("FOU", f?.id);
const codeUtilisateur = (u) => u?.code_utilisateur || codeCourt("USR", u?.id);



const csvEscape = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;

const downloadCSV = (filename, headers, rows) => {
  const csv = [
    headers.map(csvEscape).join(";"),
    ...rows.map((row) => row.map(csvEscape).join(";"))
  ].join("\n");

  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const ROLE_LABELS = {
  super_admin: "Super Admin",
  gerant: "Gérant",
  caissier: "Caissier",
  magasinier: "Magasinier",
  comptable: "Comptable",
  employe: "Employé"
};

const ROLE_DESCRIPTIONS = {
  super_admin: "Administration globale SaaS : PME clientes, utilisateurs, abonnements, paiements, support et logs.",
  gerant: "Accès total à tous les modules de sa PME.",
  caissier: "Ventes, factures, devis et clients.",
  magasinier: "Stocks, achats et fournisseurs.",
  comptable: "Dépenses, caisse, banque, créances, dettes, rapports et comptabilité.",
  employe: "Accès limité aux ventes et clients."
};

const ROLE_OPTIONS = [
  { value: "gerant", label: "Gérant" },
  { value: "caissier", label: "Caissier" },
  { value: "magasinier", label: "Magasinier" },
  { value: "comptable", label: "Comptable" },
  { value: "employe", label: "Employé" }
];

const normalizePoste = (profil) => {
  const poste = profil?.poste || profil?.role || "employe";
  if (poste === "superAdmin" || poste === "superadmin" || poste === "admin_super") return "super_admin";
  if (poste === "employer" || poste === "employee") return "employe";
  return poste;
};


const isEntrepriseSysteme = (e) => {
  if (!e) return false;
  const nom = String(e.nom || "").trim().toLowerCase();
  const code = String(e.code_entreprise || "").trim().toUpperCase();
  return e.est_systeme === true || code === "ENT-SUPER" || nom === "plateforme suivi pme" || nom === "suivi pme";
};

const emptyProduit = { id: null, nom: "", categorie_id: "", code_barres: "", image_url: "", quantite: "", seuil_alerte: "", prix_achat: "", prix_vente: "" };
const emptyPerson = { id: null, nom: "", telephone: "", email: "", adresse: "" };

function KpiCard({ label, value, sub, accent, icon: Icon }) {
  return <div className="kpi-card" style={{
    background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
    borderRadius: 16,
    padding: "13px 15px",
    flex: "1 1 168px",
    minWidth: 168,
    maxWidth: 260,
    boxShadow: "0 12px 28px rgba(15,23,42,0.07)",
    border: `1px solid ${INK}12`,
    position: "relative",
    overflow: "hidden"
  }}>
    <div style={{ position: "absolute", inset: "0 auto 0 0", width: 4, background: accent || TEAL }} />
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
      <span style={{ fontSize: 10.8, color: `${INK}88`, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.55 }}>{label}</span>
      {Icon && <span style={{ width: 28, height: 28, borderRadius: 999, background: `${accent || TEAL}14`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Icon size={15} color={accent || TEAL} strokeWidth={2.3} /></span>}
    </div>
    <div style={{ fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif", fontSize: 18.5, fontWeight: 900, color: accent || INK, marginTop: 8, letterSpacing: -0.35 }}>{value}</div>
    {sub && <div style={{ fontSize: 11.2, color: `${INK}77`, marginTop: 3, lineHeight: 1.35 }}>{sub}</div>}
  </div>;
}
function NavItem({ icon: Icon, label, active, onClick, className }) {
  return <button onClick={onClick} className={className} style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "10px 14px", borderRadius: 9, border: "none", cursor: "pointer", background: active ? "#ffffff1a" : "transparent", color: active ? "#fff" : "#ffffffaa", fontSize: 13.5, fontWeight: 700 }}><Icon size={17} />{label}</button>;
}
function SectionTitle({ title, sub }) {
  return <div style={{ margin: "6px 0 16px" }}><h2 style={{ fontFamily: "Sora, sans-serif", fontSize: 18, color: INK, margin: 0, fontWeight: 700 }}>{title}</h2>{sub && <div style={{ color: `${INK}88`, fontSize: 12.5, marginTop: 4 }}>{sub}</div>}</div>;
}
function Button({ children, onClick, type = "button", disabled, secondary, danger }) {
  const bg = danger ? CORAL : secondary ? "#fff" : TEAL;
  const color = secondary ? INK : "#fff";
  return <button type={type} onClick={onClick} disabled={disabled} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: disabled ? `${TEAL}66` : bg, color, border: secondary ? `1px solid ${INK}22` : "none", borderRadius: 8, padding: "9px 14px", fontSize: 13, fontWeight: 700, cursor: disabled ? "default" : "pointer" }}>{children}</button>;
}


function PaymentIcon({ mode, size = 22 }) {
  const m = getPaymentMode(mode);
  if (m.logo) {
    return <img src={m.logo} alt={m.label} style={{ width: size, height: size, objectFit: "contain", borderRadius: 5, background: "#fff", padding: 2 }} />;
  }
  return <span style={{ fontSize: size - 3, lineHeight: 1 }}>{m.icon}</span>;
}

function PaymentBadge({ mode, compact = false }) {
  const m = getPaymentMode(mode);
  return <span title={m.label} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: compact ? "4px 8px" : "6px 10px", borderRadius: 999, background: m.bg, border: `1px solid ${m.border}`, color: m.color, fontWeight: 900, fontSize: compact ? 11.5 : 12.5, whiteSpace: "nowrap", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)" }}><PaymentIcon mode={m.value} size={compact ? 18 : 22} />{m.label}</span>;
}

function PaymentSelect({ value, onChange, style, includeCredit = false }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
    <select style={{ ...style, minWidth: 185 }} value={value || "Espèces"} onChange={(e) => onChange(e.target.value)}>
      {paymentOptions(includeCredit).map((m) => <option key={m.value} value={m.value}>{m.icon ? `${m.icon} ` : ""}{m.label}</option>)}
    </select>
    <PaymentBadge mode={value || "Espèces"} />
  </div>;
}

function PhoneSNInput({ value, onChange, style, placeholder = "77 000 00 00" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", border: `1px solid ${INK}22`, borderRadius: 7, overflow: "hidden", background: "#fff", minWidth: 170 }}>
      <span style={{ padding: "8px 10px", background: `${TEAL}12`, color: INK, fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>🇸🇳 +221</span>
      <input
        type="tel"
        placeholder={placeholder}
        value={String(value || "").replace(/^\+221\s?/, "")}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9 ]/g, ""))}
        style={{ ...style, border: "none", minWidth: 120 }}
      />
    </div>
  );
}

function Table({ headers, children }) {
  return <div style={{ background: CARD, borderRadius: 12, overflow: "auto", border: `1px solid ${INK}0F`, boxShadow: "0 1px 3px rgba(21,34,56,0.05)" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
    <thead><tr style={{ background: `${INK}08` }}>{headers.map((h) => <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, letterSpacing: 0.4, textTransform: "uppercase", color: `${INK}88`, fontWeight: 800, whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
    <tbody>{children}</tbody>
  </table></div>;
}

export default function App() {
  const [session, setSession] = useState(undefined);
  const [profil, setProfil] = useState(null);
  const [entreprise, setEntreprise] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [superAdminMode, setSuperAdminMode] = useState(false);
  const [superTab, setSuperTab] = useState("super_dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [profilLoading, setProfilLoading] = useState(true);
  const [dashboardMasque, setDashboardMasque] = useState(() => {
    try { return localStorage.getItem("suivi_pme_dashboard_masque") === "1"; } catch { return false; }
  });

  const [produits, setProduits] = useState([]);
  const [mouvementsStock, setMouvementsStock] = useState([]);
  const [inventaires, setInventaires] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ventes, setVentes] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [depenses, setDepenses] = useState([]);
  const [journalComptable, setJournalComptable] = useState([]);
  const [clients, setClients] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [achats, setAchats] = useState([]);
  const [devis, setDevis] = useState([]);
  const [caisses, setCaisses] = useState([]);
  const [mouvementsCaisses, setMouvementsCaisses] = useState([]);
  const [banques, setBanques] = useState([]);
  const [mouvementsBanques, setMouvementsBanques] = useState([]);
  const [creances, setCreances] = useState([]);
  const [dettes, setDettes] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [presences, setPresences] = useState([]);
  const [salaires, setSalaires] = useState([]);
  const [avancesSalaires, setAvancesSalaires] = useState([]);
  const [conges, setConges] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [interactionsClients, setInteractionsClients] = useState([]);
  const [campagnes, setCampagnes] = useState([]);
  const [relances, setRelances] = useState([]);
  const [previsionsVentes, setPrevisionsVentes] = useState([]);
  const [previsionsStock, setPrevisionsStock] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [allEntreprises, setAllEntreprises] = useState([]);
  const [allProfils, setAllProfils] = useState([]);
  const [usersNonRattaches, setUsersNonRattaches] = useState([]);
  const [plans, setPlans] = useState([]);
  const [abonnements, setAbonnements] = useState([]);
  const [paiementsSaas, setPaiementsSaas] = useState([]);
  const [ticketsSupport, setTicketsSupport] = useState([]);
  const [logs, setLogs] = useState([]);
  const [messagerieSaas, setMessagerieSaas] = useState([]);
  const [backupRows, setBackupRows] = useState([]);

  const [produitForm, setProduitForm] = useState(emptyProduit);
  const [mouvementStockForm, setMouvementStockForm] = useState({ produit_id: "", type_mouvement: "entree", quantite: "", motif: "" });
  const [inventaireForm, setInventaireForm] = useState({ produit_id: "", stock_physique: "" });
  const [categorieForm, setCategorieForm] = useState({ id: null, nom: "" });
  const [clientForm, setClientForm] = useState(emptyPerson);
  const [fournisseurForm, setFournisseurForm] = useState(emptyPerson);
  const [venteForm, setVenteForm] = useState({ produit_id: "", client_id: "", quantite: 1, type_vente: "comptant", mode_paiement: "Espèces", montant_paye: "", date_echeance: "" });
  const [venteLignes, setVenteLignes] = useState([{ produit_id: "", quantite: 1 }]);
  const [factureEditForm, setFactureEditForm] = useState(null);
  const [paiementForm, setPaiementForm] = useState({ vente_id: "", montant: "", mode_paiement: "Espèces", reference: "" });
  const [devisForm, setDevisForm] = useState({ client_id: "" });
  const [devisLignes, setDevisLignes] = useState([{ produit_id: "", quantite: 1 }]);
  const [achatForm, setAchatForm] = useState({ produit_id: "", fournisseur_id: "", quantite: 1, prix_unitaire: "" });
  const [achatsLignes, setAchatsLignes] = useState([{ mode: "existant", produit_id: "", nom: "", categorie_id: "", quantite: 1, prix_unitaire: "", prix_vente: "", seuil_alerte: 5 }]);
  const [depenseForm, setDepenseForm] = useState({ categorie: CATEGORIES_DEPENSES[0], montant: "", description: "" });
  const [journalForm, setJournalForm] = useState({ type_operation: "ajustement", reference: "", description: "", debit: "", credit: "" });
  const [entrepriseForm, setEntrepriseForm] = useState({ nom: "", telephone: "", email: "", adresse: "", ninea: "", rccm: "", logo_url: "" });
  const [caisseForm, setCaisseForm] = useState({ nom: "Caisse principale", solde: 0 });
  const [mouvementCaisseForm, setMouvementCaisseForm] = useState({ caisse_id: "", type: "entree", montant: "", description: "", mode_paiement: "Espèces", reference: "" });
  const [caissePeriode, setCaissePeriode] = useState("jour");
  const [caisseDateDebut, setCaisseDateDebut] = useState(today());
  const [caisseDateFin, setCaisseDateFin] = useState(today());
  const [caisseSearch, setCaisseSearch] = useState("");
  const [caisseTypeFilter, setCaisseTypeFilter] = useState("tous");
  const [caisseModeFilter, setCaisseModeFilter] = useState("tous");
  const [caissePage, setCaissePage] = useState(1);
  const [ventesPage, setVentesPage] = useState(1);
  const [ventesSearch, setVentesSearch] = useState("");
  const [ventesDateDebut, setVentesDateDebut] = useState(debutDuMois());
  const [ventesDateFin, setVentesDateFin] = useState(today());
  const [ventesModeFilter, setVentesModeFilter] = useState("tous");
  const [ventesStatutFilter, setVentesStatutFilter] = useState("tous");
  const [facturesPage, setFacturesPage] = useState(1);
  const [facturesSearch, setFacturesSearch] = useState("");
  const [facturesDateDebut, setFacturesDateDebut] = useState(debutDuMois());
  const [facturesDateFin, setFacturesDateFin] = useState(today());
  const [facturesModeFilter, setFacturesModeFilter] = useState("tous");
  const [facturesStatutFilter, setFacturesStatutFilter] = useState("tous");
  const [depensesPage, setDepensesPage] = useState(1);
  const [depensesSearch, setDepensesSearch] = useState("");
  const [depensesDateDebut, setDepensesDateDebut] = useState(debutDuMois());
  const [depensesDateFin, setDepensesDateFin] = useState(today());
  const [depensesModeFilter, setDepensesModeFilter] = useState("tous");
  const [depensesCategorieFilter, setDepensesCategorieFilter] = useState("toutes");
  const [clientsPage, setClientsPage] = useState(1);
  const [clientsSearch, setClientsSearch] = useState("");
  const [fournisseursPage, setFournisseursPage] = useState(1);
  const [fournisseursSearch, setFournisseursSearch] = useState("");
  const [utilisateursPage, setUtilisateursPage] = useState(1);
  const [utilisateurRoleFilter, setUtilisateurRoleFilter] = useState("tous");
  const [utilisateurStatutFilter, setUtilisateurStatutFilter] = useState("tous");
  const [journalPage, setJournalPage] = useState(1);
  const [journalSearch, setJournalSearch] = useState("");
  const [journalDateDebut, setJournalDateDebut] = useState(debutDuMois());
  const [journalDateFin, setJournalDateFin] = useState(today());
  const [journalTypeFilter, setJournalTypeFilter] = useState("tous");
  const [rapportPage, setRapportPage] = useState(1);
  const [rapportSearch, setRapportSearch] = useState("");
  const [employesPage, setEmployesPage] = useState(1);
  const [employesSearch, setEmployesSearch] = useState("");
  const [employesStatutFilter, setEmployesStatutFilter] = useState("tous");
  const [presencesPage, setPresencesPage] = useState(1);
  const [presencesSearch, setPresencesSearch] = useState("");
  const [presencesDateDebut, setPresencesDateDebut] = useState(debutDuMois());
  const [presencesDateFin, setPresencesDateFin] = useState(today());
  const [presencesStatutFilter, setPresencesStatutFilter] = useState("tous");
  const [avancesPage, setAvancesPage] = useState(1);
  const [avancesSearch, setAvancesSearch] = useState("");
  const [salairesPage, setSalairesPage] = useState(1);
  const [salairesSearch, setSalairesSearch] = useState("");
  const [congesPage, setCongesPage] = useState(1);
  const [congesSearch, setCongesSearch] = useState("");
  const lignesParPagePro = 5;
  const [banqueForm, setBanqueForm] = useState({ nom: "", numero_compte: "", solde: 0 });
  const [mouvementBanqueForm, setMouvementBanqueForm] = useState({ banque_id: "", type: "depot", montant: "", description: "" });
  const [creanceForm, setCreanceForm] = useState({ client_id: "", montant: "", date_echeance: "" });
  const [detteForm, setDetteForm] = useState({ fournisseur_id: "", montant: "", date_echeance: "" });
  const [utilisateurSearch, setUtilisateurSearch] = useState("");
  const [nouvelInviteRole, setNouvelInviteRole] = useState("employe");
  const [newUserForm, setNewUserForm] = useState({ entreprise_id: "", nom_complet: "", email: "", telephone: "", poste: "employe" });
  const [newUserAccess, setNewUserAccess] = useState(null);
  const [employeForm, setEmployeForm] = useState({ id: null, nom_complet: "", telephone: "", email: "", poste: "", salaire_base: "", date_embauche: today(), statut: "actif" });
  const [presenceForm, setPresenceForm] = useState({ employe_id: "", date_presence: today(), statut: "present", heure_arrivee: "", heure_depart: "", note: "" });
  const [salaireForm, setSalaireForm] = useState({ employe_id: "", mois: new Date().toISOString().slice(0,7), primes: "", retenues: "" });
  const [avanceForm, setAvanceForm] = useState({ employe_id: "", montant: "", date_avance: today(), motif: "" });
  const [congeForm, setCongeForm] = useState({ employe_id: "", date_debut: today(), date_fin: today(), type_conge: "annuel", statut: "en_attente", motif: "" });
  const [prospectForm, setProspectForm] = useState({ id: null, nom: "", telephone: "", email: "", source: "", statut: "nouveau", note: "" });
  const [interactionForm, setInteractionForm] = useState({ client_id: "", prospect_id: "", type_interaction: "appel", message: "", date_interaction: today() });
  const [campagneForm, setCampagneForm] = useState({ nom: "", canal: "whatsapp", message: "", statut: "brouillon" });
  const [relanceForm, setRelanceForm] = useState({ client_id: "", prospect_id: "", objet: "", date_relance: today(), statut: "a_faire", note: "" });
  const [rapportType, setRapportType] = useState("ventes");
  const [rapportDebut, setRapportDebut] = useState(debutDuMois());
  const [rapportFin, setRapportFin] = useState(today());
  const [planForm, setPlanForm] = useState({ nom: "", prix_mensuel: "", limite_utilisateurs: 1, limite_produits: 100, modules: "", actif: true });
  const [ticketForm, setTicketForm] = useState({ sujet: "", message: "", priorite: "normale" });
  const [abonnementForm, setAbonnementForm] = useState({ entreprise_id: "", plan_id: "", statut: "actif", date_fin: "" });
  const [paiementLocalForm, setPaiementLocalForm] = useState({ moyen: "Wave", reference: "", montant: String(ABONNEMENT_MENSUEL) });
  const [superPmeForm, setSuperPmeForm] = useState({ nom: "", telephone: "", email: "", adresse: "", ninea: "", rccm: "", plan_id: "", date_fin: "" });
  const [premierGerantForm, setPremierGerantForm] = useState({ creer: true, nom_complet: "", email: "", telephone: "", mot_de_passe: "" });
  const [selectedPmeAdmin, setSelectedPmeAdmin] = useState(null);
  const [rattachementForm, setRattachementForm] = useState({ user_id: "", entreprise_id: "", poste: "employe" });
  const [editPmeForm, setEditPmeForm] = useState({ nom: "", telephone: "", email: "", adresse: "", ninea: "", rccm: "", statut_saas: "actif" });
  const [superUserSearch, setSuperUserSearch] = useState("");
  const [superCrmProspectForm, setSuperCrmProspectForm] = useState({ nom: "", telephone: "", email: "", source: "", statut: "nouveau", note: "" });
  const [superCrmCampagneForm, setSuperCrmCampagneForm] = useState({ nom: "", canal: "whatsapp", message: "", statut: "brouillon" });
  const [superCrmRelanceForm, setSuperCrmRelanceForm] = useState({ prospect_id: "", objet: "", date_relance: today(), note: "" });
  const [messageSaasForm, setMessageSaasForm] = useState({ id: null, sujet: "Demande de création utilisateur", message: "" });
  const [reponseSaasForm, setReponseSaasForm] = useState({ id: null, message: "" });
  const [messageModal, setMessageModal] = useState({ open: false, title: "", message: "" });
  const [mailBox, setMailBox] = useState("recus");
  const [superMailBox, setSuperMailBox] = useState("recus");
  const [mailSearch, setMailSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [logModuleFilter, setLogModuleFilter] = useState("tous");
  const [logDateDebut, setLogDateDebut] = useState("");
  const [logDateFin, setLogDateFin] = useState("");
  const [pageLogs, setPageLogs] = useState(1);
  const lignesParPageLogs = 5;
  const [themeKey, setThemeKey] = useState(() => {
    try { return localStorage.getItem("suivi_pme_theme") || "emeraude"; } catch { return "classique"; }
  });

  const activeTheme = THEME_OPTIONS[themeKey] || THEME_OPTIONS.emeraude;
  const themeAccent = activeTheme.accent;
  const themeBg = activeTheme.bg;
  const themeSidebar = activeTheme.sidebar;
  const themeCard = activeTheme.card;
  const themeText = activeTheme.text;
  const inputStyle = { fontSize: 13, padding: "8px 10px", borderRadius: 7, border: `1px solid ${INK}22`, outline: "none", background: "#fff", color: INK };
  const cell = { padding: "9px 14px" };
  const showError = (err, fallback) => { console.error(err); setMessage(err?.message || fallback || "Une erreur est survenue."); };

  useEffect(() => {
    const profilTheme = profil?.theme;
    if (profilTheme && THEME_OPTIONS[profilTheme] && profilTheme !== themeKey) {
      setThemeKey(profilTheme);
    }
  }, [profil?.theme]);

  async function changerTheme(nouveauTheme) {
    if (!THEME_OPTIONS[nouveauTheme]) return;
    setThemeKey(nouveauTheme);
    try { localStorage.setItem("suivi_pme_theme", nouveauTheme); } catch {}
    if (profil?.id) {
      const { error } = await supabase.from("profils").update({ theme: nouveauTheme }).eq("id", profil.id);
      if (error) console.warn("Thème non sauvegardé dans Supabase", error);
    }
  }

  // auto_hide_message_v694
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3500);
    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    try { localStorage.setItem("suivi_pme_dashboard_masque", dashboardMasque ? "1" : "0"); } catch {}
  }, [dashboardMasque]);


  useEffect(() => {
    try { localStorage.setItem("suivi_pme_theme", themeKey); } catch {}
    document.documentElement.style.setProperty("--suivi-accent", activeTheme.accent);
    document.documentElement.style.setProperty("--suivi-bg", activeTheme.bg);
    document.documentElement.style.setProperty("--suivi-sidebar", activeTheme.sidebar);
  }, [themeKey, activeTheme.accent, activeTheme.bg, activeTheme.sidebar]);


  async function addLog(module, action, details = "") {
    try {
      await supabase.from("logs").insert({
        entreprise_id: entreprise?.id || profil?.entreprise_id || null,
        utilisateur_id: profil?.id || null,
        module,
        action,
        details
      });
    } catch (e) {
      console.warn("Log non enregistré", e);
    }
  }

  const isSuperAdmin = normalizePoste(profil) === "super_admin" || profil?.email === "pcamara0630@gmail.com";


  function demanderCreationUtilisateurDepuisModule() {
    setTab("messagerie");
    setMessageSaasForm({
      id: null,
      sujet: "Demande de création utilisateur",
      message: "Bonjour Super Admin, merci de créer un compte utilisateur :\\n\\nNom complet : \\nEmail : \\nTéléphone : \\nRôle souhaité : Caissier / Employé / Magasinier / Comptable\\n\\nMerci."
    });
    setMessage("Votre demande de création utilisateur est prête dans la messagerie.");
  }


  function getEntrepriseSystemeId() {
    return allEntreprises.find(e => e.code_entreprise === "ENT-SUPER")?.id;
  }

  function getEntrepriseCreationUser() {
    const selected = newUserForm?.entreprise_id || employeForm?.entreprise_id || "";
    if (selected) return { entreprise_id: selected, en_attente: false };
    return { entreprise_id: null, en_attente: true };
  }

  function getUtilisateursAffiches() {
    if (isSuperAdmin) return allProfils.length ? allProfils : utilisateurs;

    return utilisateurs.filter((u) =>
      u.poste !== "super_admin" &&
      (
        u.id === profil?.id ||
        u.created_by === profil?.id
      )
    );
  }

  function peutGererUtilisateur(u) {
    if (isSuperAdmin) return true;
    return u?.created_by === profil?.id;
  }


  const chargerProfilEtEntreprise = useCallback(async () => {
    setProfilLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const current = sessionData.session;
      setSession(current);
      if (!current) {
        setProfil(null);
        setEntreprise(null);
        setSuperAdminMode(false);
        return;
      }

      const { data: p, error: pe } = await supabase
        .from("profils")
        .select("*")
        .or(`id.eq.${current.user.id},email.eq.${current.user.email}`)
        .maybeSingle();

      console.log("SESSION USER:", current.user);
      console.log("PROFIL CHARGÉ:", p, pe);

      if (pe) {
        setProfil(null);
        setEntreprise(null);
        showError(pe, "Impossible de charger le profil.");
        return;
      }

      setProfil(p || null);

      const superAdminDetected = p?.poste === "super_admin" || p?.email === "pcamara0630@gmail.com";
      if (superAdminDetected) {
        setEntreprise(null);
        setSuperAdminMode(true);
        return;
      }

      if (!p?.entreprise_id) {
        setEntreprise(null);
        if (p) setMessage("Votre compte est connecté, mais il est en attente de rattachement à une PME.");
        return;
      }

      const { data: e, error: ee } = await supabase.from("entreprises").select("*").eq("id", p.entreprise_id).maybeSingle();
      if (ee) showError(ee, "Impossible de charger l'entreprise.");
      setEntreprise(e || null);
      setEntrepriseForm({ nom: e?.nom || "", telephone: e?.telephone || "", email: e?.email || "", adresse: e?.adresse || "", ninea: e?.ninea || "", rccm: e?.rccm || "", logo_url: e?.logo_url || "" });
    } finally {
      setProfilLoading(false);
    }
  }, []);

  useEffect(() => {
    chargerProfilEtEntreprise();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => { setSession(s); setTimeout(() => chargerProfilEtEntreprise(), 0); });
    return () => listener.subscription.unsubscribe();
  }, [chargerProfilEtEntreprise]);

  const chargerDonnees = useCallback(async () => {
    if (!profil) return;
    if (isSuperAdmin && !profil?.entreprise_id) {
      setLoading(false);
      return;
    }
    setLoading(true); setMessage("");
    const queries = await Promise.all([
      supabase.from("produits").select("*").order("nom"),
      supabase.from("ventes").select("*").gte("date_vente", debutDuMois()).order("date_vente", { ascending: false }),
      supabase.from("depenses").select("*").gte("date_depense", debutDuMois()).order("date_depense", { ascending: false }),
      supabase.from("clients").select("*").order("nom"),
      supabase.from("fournisseurs").select("*").order("nom"),
      supabase.from("achats").select("*").gte("date_achat", debutDuMois()).order("date_achat", { ascending: false }),
      supabase.from("devis").select("*").order("date_devis", { ascending: false }),
      supabase.from("caisses").select("*").order("created_at", { ascending: false }),
      supabase.from("mouvements_caisses").select("*").order("created_at", { ascending: false }),
      supabase.from("banques").select("*").order("created_at", { ascending: false }),
      supabase.from("mouvements_banques").select("*").order("created_at", { ascending: false }),
      supabase.from("creances").select("*").order("created_at", { ascending: false }),
      supabase.from("dettes").select("*").order("created_at", { ascending: false }),
      supabase.from("paiements").select("*").order("date_paiement", { ascending: false }),
      supabase.from("mouvements_stock").select("*").order("created_at", { ascending: false }),
      supabase.from("inventaires").select("*").order("created_at", { ascending: false }),
      supabase.from("journal_comptable").select("*").order("date_operation", { ascending: false }),
      supabase.from("employes").select("*").order("nom_complet"),
      supabase.from("presences").select("*").order("date_presence", { ascending: false }),
      supabase.from("salaires").select("*").order("mois", { ascending: false }),
      supabase.from("avances_salaires").select("*").order("date_avance", { ascending: false }),
      supabase.from("conges").select("*").order("date_debut", { ascending: false }),
      supabase.from("prospects").select("*").order("created_at", { ascending: false }),
      supabase.from("interactions_clients").select("*").order("date_interaction", { ascending: false }),
      supabase.from("campagnes").select("*").order("created_at", { ascending: false }),
      supabase.from("relances").select("*").order("date_relance", { ascending: true }),
      supabase.from("previsions_ventes").select("*").order("date_prevision", { ascending: true }),
      supabase.from("previsions_stock").select("*").order("date_prevision", { ascending: true }),
      supabase.from("anomalies").select("*").order("created_at", { ascending: false }),
    ]);
    const firstError = queries.find((r) => r.error)?.error;
    if (firstError) showError(firstError, "Erreur de chargement. Avez-vous exécuté supabase_migration_v2.sql ?");
    setProduits(queries[0].data || []); setVentes(queries[1].data || []); setDepenses(queries[2].data || []);
    setClients(queries[3].data || []); setFournisseurs(queries[4].data || []); setAchats(queries[5].data || []);
    setDevis(queries[6].data || []);
    setCaisses(queries[7].data || []); setMouvementsCaisses(queries[8].data || []);
    setBanques(queries[9].data || []); setMouvementsBanques(queries[10].data || []);
    setCreances(queries[11].data || []); setDettes(queries[12].data || []);
    setPaiements(queries[13].data || []);
    setMouvementsStock(queries[14].data || []); setInventaires(queries[15].data || []);
    setJournalComptable(queries[16].data || []);
    setEmployes(queries[17].data || []); setPresences(queries[18].data || []);
    setSalaires(queries[19].data || []); setAvancesSalaires(queries[20].data || []);
    setConges(queries[21].data || []);
    setProspects(queries[22].data || []); setInteractionsClients(queries[23].data || []);
    setCampagnes(queries[24].data || []); setRelances(queries[25].data || []);
    setPrevisionsVentes(queries[26].data || []); setPrevisionsStock(queries[27].data || []);
    setAnomalies(queries[28].data || []);
    if (queries[17].data?.length) {
      setPresenceForm((f) => ({ ...f, employe_id: f.employe_id || queries[17].data[0].id }));
      setSalaireForm((f) => ({ ...f, employe_id: f.employe_id || queries[17].data[0].id }));
      setAvanceForm((f) => ({ ...f, employe_id: f.employe_id || queries[17].data[0].id }));
      setCongeForm((f) => ({ ...f, employe_id: f.employe_id || queries[17].data[0].id }));
    }

    const usersReq = await supabase
      .from("profils")
      .select("*")
      .eq("entreprise_id", profil.entreprise_id)
      .order("created_at", { ascending: false });

    if (usersReq.error) showError(usersReq.error, "Impossible de charger les utilisateurs.");
    setUtilisateurs(usersReq.data || []);

    const categoriesReq = await supabase
      .from("categories")
      .select("*")
      .eq("entreprise_id", profil.entreprise_id)
      .order("nom");

    if (categoriesReq.error) showError(categoriesReq.error, "Impossible de charger les catégories.");
    setCategories(categoriesReq.data || []);
    if (queries[0].data?.length) {
      setVenteForm((f) => ({ ...f, produit_id: f.produit_id || queries[0].data[0].id }));
      setVenteLignes((ls) => ls.map(l => ({ ...l, produit_id: l.produit_id || queries[0].data[0].id })));
      setDevisLignes((ls) => ls.map(l => ({ ...l, produit_id: l.produit_id || queries[0].data[0].id })));
      setAchatForm((f) => ({ ...f, produit_id: f.produit_id || queries[0].data[0].id }));
      setAchatsLignes((ls) => ls.map(l => ({ ...l, produit_id: l.produit_id || queries[0].data[0].id })));
      setMouvementStockForm((f) => ({ ...f, produit_id: f.produit_id || queries[0].data[0].id }));
      setInventaireForm((f) => ({ ...f, produit_id: f.produit_id || queries[0].data[0].id }));
    }
    setLoading(false);
  }, [profil, isSuperAdmin]);
  useEffect(() => { chargerDonnees(); }, [chargerDonnees]);

  const chargerMessagerieSaas = useCallback(async () => {
    if (!profil) return;
    const { data, error } = await supabase
      .from("messagerie_saas")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setMessagerieSaas(data || []);
  }, [profil]);

  useEffect(() => { chargerMessagerieSaas(); }, [chargerMessagerieSaas]);

  useEffect(() => {
    if (!profil) return;
    const channel = supabase
      .channel("messagerie_saas_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "messagerie_saas" }, () => {
        chargerMessagerieSaas?.();
        chargerDonnees?.();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [profil, chargerMessagerieSaas, chargerDonnees]);



  const chargerSuperAdminData = useCallback(async () => {
    if (!profil || !isSuperAdmin) return;
    const reqs = await Promise.all([
      supabase.from("entreprises").select("*").order("created_at", { ascending: false }),
      supabase.from("profils").select("*").order("created_at", { ascending: false }),
      supabase.from("plans").select("*").order("prix_mensuel"),
      supabase.from("abonnements").select("*").order("created_at", { ascending: false }),
      supabase.from("paiements_saas").select("*").order("date_paiement", { ascending: false }),
      supabase.from("tickets_support").select("*").order("created_at", { ascending: false }),
      supabase.from("logs").select("*").order("created_at", { ascending: false }),
      supabase.from("sauvegardes").select("*").order("created_at", { ascending: false }),
      supabase.from("messagerie_saas").select("*").order("created_at", { ascending: false })
    ]);
    const err = reqs.find(r => r.error)?.error;
    if (err) return showError(err, "Impossible de charger les données Super Admin. Vérifiez les policies RLS.");
    setAllEntreprises(reqs[0].data || []);
    setAllProfils(reqs[1].data || []);
    setPlans(reqs[2].data || []);
    setAbonnements(reqs[3].data || []);
    setPaiementsSaas(reqs[4].data || []);
    setTicketsSupport(reqs[5].data || []);
    setLogs(reqs[6].data || []);
    setBackupRows(reqs[7].data || []);
    setMessagerieSaas(reqs[9]?.data || reqs[8]?.data || []);
  }, [profil, isSuperAdmin]);

  useEffect(() => { chargerSuperAdminData(); }, [chargerSuperAdminData]);


  const ca = useMemo(() => ventes.reduce((s, v) => s + Number(v.quantite) * Number(v.prix_unitaire), 0), [ventes]);
  const depTotal = useMemo(() => depenses.reduce((s, d) => s + Number(d.montant), 0), [depenses]);
  const achatsTotal = useMemo(() => achats.reduce((s, a) => s + Number(a.quantite) * Number(a.prix_unitaire), 0), [achats]);
  const coutVendu = useMemo(() => ventes.reduce((s, v) => { const p = produits.find((x) => x.id === v.produit_id); return s + (p ? Number(p.prix_achat) * Number(v.quantite) : 0); }, 0), [ventes, produits]);
  const marge = ca - coutVendu - depTotal;
  const valeurStock = useMemo(() => produits.reduce((s, p) => s + Number(p.quantite) * Number(p.prix_achat), 0), [produits]);
  const produitsAlerte = produits.filter((p) => Number(p.quantite) <= Number(p.seuil_alerte));
  const produitsRupture = useMemo(() => produits.filter((p) => Number(p.quantite || 0) <= 0), [produits]);
  const valeurVenteStock = useMemo(() => produits.reduce((s, p) => s + Number(p.quantite || 0) * Number(p.prix_vente || 0), 0), [produits]);
  const depensesParCategorie = useMemo(() => Object.entries(depenses.reduce((m, d) => ({ ...m, [d.categorie]: (m[d.categorie] || 0) + Number(d.montant) }), {})).map(([categorie, valeur]) => ({ categorie, valeur })), [depenses]);
  const chartData = [{ mois: "Ce mois-ci", ca, depenses: depTotal, achats: achatsTotal }];
  const soldeCaisses = useMemo(() => caisses.reduce((s, c) => s + Number(c.solde || 0), 0), [caisses]);
  const totalEntreesCaisse = useMemo(() => mouvementsCaisses.filter(m => m.type === "entree").reduce((s, m) => s + Number(m.montant || 0), 0), [mouvementsCaisses]);
  const totalSortiesCaisse = useMemo(() => mouvementsCaisses.filter(m => m.type === "sortie").reduce((s, m) => s + Number(m.montant || 0), 0), [mouvementsCaisses]);
  const totalDepensesCaisse = useMemo(() => totalSortiesCaisse || depTotal, [totalSortiesCaisse, depTotal]);
  const caisseDateRange = useMemo(() => {
    const now = new Date();
    const iso = (d) => d.toISOString().slice(0, 10);
    if (caissePeriode === "jour") return { debut: today(), fin: today(), label: "Aujourd'hui" };
    if (caissePeriode === "semaine") { const d = new Date(); const day = d.getDay() || 7; d.setDate(d.getDate() - day + 1); const f = new Date(d); f.setDate(d.getDate() + 6); return { debut: iso(d), fin: iso(f), label: "Cette semaine" }; }
    if (caissePeriode === "mois") return { debut: debutDuMois(), fin: today(), label: "Ce mois" };
    if (caissePeriode === "annee") return { debut: `${now.getFullYear()}-01-01`, fin: today(), label: "Cette année" };
    return { debut: caisseDateDebut || "1900-01-01", fin: caisseDateFin || today(), label: "Période personnalisée" };
  }, [caissePeriode, caisseDateDebut, caisseDateFin]);
  const getModeCaisse = (m) => m.mode_paiement || m.mode || (/orange/i.test(m.description || "") ? "Orange Money" : /wave/i.test(m.description || "") ? "Wave" : /chèque|cheque/i.test(m.description || "") ? "Chèque" : "Espèces");
  const modesCaisseDisponibles = useMemo(() => Array.from(new Set(["Espèces", "Orange Money", "Wave", "Carte bancaire", "Virement", "Chèque", ...mouvementsCaisses.map(getModeCaisse)])).filter(Boolean), [mouvementsCaisses]);
  const mouvementsCaissesFiltres = useMemo(() => {
    const q = caisseSearch.trim().toLowerCase();
    return mouvementsCaisses.filter((m) => {
      const dateIso = String(m.created_at || "").slice(0, 10);
      const mode = getModeCaisse(m);
      const ref = m.reference_operation || m.reference || "";
      const caisse = caisses.find(c => c.id === m.caisse_id)?.nom || "";
      const inDate = dateIso >= caisseDateRange.debut && dateIso <= caisseDateRange.fin;
      const inType = caisseTypeFilter === "tous" || m.type === caisseTypeFilter;
      const inMode = caisseModeFilter === "tous" || mode === caisseModeFilter;
      const inSearch = !q || [ref, m.description, caisse, mode, m.montant].some(v => String(v || "").toLowerCase().includes(q));
      return inDate && inType && inMode && inSearch;
    });
  }, [mouvementsCaisses, caisses, caisseDateRange, caisseTypeFilter, caisseModeFilter, caisseSearch]);
  const caisseResumeFiltre = useMemo(() => {
    const entrees = mouvementsCaissesFiltres.filter(m => m.type === "entree").reduce((s, m) => s + Number(m.montant || 0), 0);
    const sorties = mouvementsCaissesFiltres.filter(m => m.type === "sortie").reduce((s, m) => s + Number(m.montant || 0), 0);
    return { entrees, sorties, solde: entrees - sorties, total: mouvementsCaissesFiltres.length };
  }, [mouvementsCaissesFiltres]);
  const mouvementsCaissesGroupesJour = useMemo(() => {
    const map = mouvementsCaissesFiltres.reduce((acc, m) => { const key = String(m.created_at || "").slice(0, 10) || "Sans date"; (acc[key] ||= []).push(m); return acc; }, {});
    return Object.entries(map).sort((a,b)=>String(b[0]).localeCompare(String(a[0]))).map(([date, rows]) => ({
      date, rows, entrees: rows.filter(m=>m.type==="entree").reduce((s,m)=>s+Number(m.montant||0),0), sorties: rows.filter(m=>m.type==="sortie").reduce((s,m)=>s+Number(m.montant||0),0)
    }));
  }, [mouvementsCaissesFiltres]);
  const mouvementsCaissesPage = useMemo(() => mouvementsCaissesFiltres.slice((caissePage - 1) * lignesParPagePro, caissePage * lignesParPagePro), [mouvementsCaissesFiltres, caissePage]);
  const pagesCaisse = Math.max(1, Math.ceil(mouvementsCaissesFiltres.length / lignesParPagePro));

  const modePaiementOptionsPro = useMemo(() => PAYMENT_MODES.map((m) => m.value), []);
  const inDateRange = (dateValue, debut, fin) => {
    const d = String(dateValue || "").slice(0, 10);
    if (!d) return true;
    return d >= (debut || "1900-01-01") && d <= (fin || "2999-12-31");
  };

  const ventesRegroupeesParFacture = useMemo(() => regrouperVentesParFacture(ventes, produits), [ventes, produits]);

  const ventesFiltreesPro = useMemo(() => {
    const q = ventesSearch.trim().toLowerCase();
    return ventesRegroupeesParFacture.filter(v => {
      const c = clients.find(x => x.id === v.client_id);
      const statut = v.statut || "validée";
      const mode = v.mode_paiement || "Espèces";
      const matchDate = inDateRange(v.date_vente || v.created_at, ventesDateDebut, ventesDateFin);
      const matchMode = ventesModeFilter === "tous" || mode === ventesModeFilter;
      const matchStatut = ventesStatutFilter === "tous" || statut === ventesStatutFilter;
      const produitsTexte = (v.lignes_facture || []).map(l => { const p = produits.find(x => x.id === l.produit_id); return p?.nom || ""; }).join(" ");
      const matchSearch = !q || [v.date_vente, factureReferenceGroupe(v), c?.nom, produitsTexte, v.produits_label, statut, mode, v.montant_paye, v.reste_a_payer, v.total_facture].some(x => String(x || "").toLowerCase().includes(q));
      return matchDate && matchMode && matchStatut && matchSearch;
    });
  }, [ventesRegroupeesParFacture, ventesSearch, produits, clients, ventesDateDebut, ventesDateFin, ventesModeFilter, ventesStatutFilter]);
  const ventesPageRows = useMemo(() => ventesFiltreesPro.slice((ventesPage - 1) * lignesParPagePro, ventesPage * lignesParPagePro), [ventesFiltreesPro, ventesPage]);
  const pagesVentes = Math.max(1, Math.ceil(ventesFiltreesPro.length / lignesParPagePro));

  const facturesFiltreesPro = useMemo(() => {
    const q = facturesSearch.trim().toLowerCase();
    return ventesRegroupeesParFacture.filter(v => {
      const c = clients.find(x => x.id === v.client_id);
      const statut = v.statut || "validée";
      const mode = v.mode_paiement || "Espèces";
      const matchDate = inDateRange(v.date_vente || v.created_at, facturesDateDebut, facturesDateFin);
      const matchMode = facturesModeFilter === "tous" || mode === facturesModeFilter;
      const matchStatut = facturesStatutFilter === "tous" || statut === facturesStatutFilter;
      const produitsTexte = (v.lignes_facture || []).map(l => { const p = produits.find(x => x.id === l.produit_id); return p?.nom || ""; }).join(" ");
      const matchSearch = !q || [v.date_vente, factureReferenceGroupe(v), c?.nom, produitsTexte, v.produits_label, statut, mode, v.montant_paye, v.reste_a_payer, v.total_facture].some(x => String(x || "").toLowerCase().includes(q));
      return matchDate && matchMode && matchStatut && matchSearch;
    });
  }, [ventesRegroupeesParFacture, facturesSearch, produits, clients, facturesDateDebut, facturesDateFin, facturesModeFilter, facturesStatutFilter]);
  const facturesPageRows = useMemo(() => facturesFiltreesPro.slice((facturesPage - 1) * lignesParPagePro, facturesPage * lignesParPagePro), [facturesFiltreesPro, facturesPage]);
  const pagesFactures = Math.max(1, Math.ceil(facturesFiltreesPro.length / lignesParPagePro));

  const depensesFiltreesPro = useMemo(() => {
    const q = depensesSearch.trim().toLowerCase();
    return depenses.filter(d => {
      const mode = d.mode_paiement || "Espèces";
      const matchDate = inDateRange(d.date_depense || d.created_at, depensesDateDebut, depensesDateFin);
      const matchMode = depensesModeFilter === "tous" || mode === depensesModeFilter;
      const matchCategorie = depensesCategorieFilter === "toutes" || d.categorie === depensesCategorieFilter;
      const matchSearch = !q || [d.date_depense, d.categorie, d.description, mode, d.reference, d.montant].some(x => String(x || "").toLowerCase().includes(q));
      return matchDate && matchMode && matchCategorie && matchSearch;
    });
  }, [depenses, depensesSearch, depensesDateDebut, depensesDateFin, depensesModeFilter, depensesCategorieFilter]);
  const depensesPageRows = useMemo(() => depensesFiltreesPro.slice((depensesPage - 1) * lignesParPagePro, depensesPage * lignesParPagePro), [depensesFiltreesPro, depensesPage]);
  const pagesDepenses = Math.max(1, Math.ceil(depensesFiltreesPro.length / lignesParPagePro));
  const soldeBanques = useMemo(() => banques.reduce((s, b) => s + Number(b.solde || 0), 0), [banques]);
  const totalCreances = useMemo(() => creances.filter(c => c.statut !== "paye").reduce((s, c) => s + Number(c.montant || 0), 0), [creances]);
  const totalDettes = useMemo(() => dettes.filter(d => d.statut !== "paye").reduce((s, d) => s + Number(d.montant || 0), 0), [dettes]);


  const logModulesDisponibles = useMemo(() => Array.from(new Set(logs.map(l => l.module).filter(Boolean))).sort(), [logs]);
  const logsFiltres = useMemo(() => {
    const q = logSearch.trim().toLowerCase();
    return logs.filter((l) => {
      const dateLog = String(l.created_at || "").slice(0, 10);
      const entrepriseNom = allEntreprises.find(e => e.id === l.entreprise_id)?.nom || "";
      const utilisateurNom = allProfils.find(u => u.id === l.utilisateur_id)?.nom_complet || "";
      const matchSearch = !q
        || String(l.module || "").toLowerCase().includes(q)
        || String(l.action || "").toLowerCase().includes(q)
        || String(l.details || "").toLowerCase().includes(q)
        || String(entrepriseNom).toLowerCase().includes(q)
        || String(utilisateurNom).toLowerCase().includes(q);
      const matchModule = logModuleFilter === "tous" || l.module === logModuleFilter;
      const matchDebut = !logDateDebut || dateLog >= logDateDebut;
      const matchFin = !logDateFin || dateLog <= logDateFin;
      return matchSearch && matchModule && matchDebut && matchFin;
    });
  }, [logs, logSearch, logModuleFilter, logDateDebut, logDateFin, allEntreprises, allProfils]);
  const totalPagesLogs = useMemo(() => Math.max(1, Math.ceil(logsFiltres.length / lignesParPageLogs)), [logsFiltres.length]);
  const logsAffiches = useMemo(() => logsFiltres.slice((pageLogs - 1) * lignesParPageLogs, pageLogs * lignesParPageLogs), [logsFiltres, pageLogs]);

  useEffect(() => {
    setPageLogs(1);
  }, [logSearch, logModuleFilter, logDateDebut, logDateFin]);

  const ecrituresAuto = useMemo(() => {
    const rows = [];
    ventes.forEach(v => {
      const total = Number(v.quantite || 0) * Number(v.prix_unitaire || 0);
      rows.push({
        date_operation: v.date_vente,
        type_operation: "vente",
        reference: factureReference(v),
        description: `Vente / Facture ${factureReference(v)}`,
        debit: 0,
        credit: total
      });
    });
    achats.forEach(a => {
      const p = produits.find(x => x.id === a.produit_id);
      rows.push({
        date_operation: a.date_achat,
        type_operation: "achat",
        reference: "ACHAT",
        description: `Achat ${p?.nom || ""}`,
        debit: Number(a.quantite || 0) * Number(a.prix_unitaire || 0),
        credit: 0
      });
    });
    depenses.forEach(d => rows.push({
      date_operation: d.date_depense,
      type_operation: "depense",
      reference: d.categorie,
      description: d.description || d.categorie,
      debit: Number(d.montant || 0),
      credit: 0
    }));
    paiements.forEach(p => rows.push({
      date_operation: p.date_paiement,
      type_operation: "paiement",
      reference: p.reference || "PAIEMENT",
      description: `Paiement ${p.mode_paiement || ""}`,
      debit: Number(p.montant || 0),
      credit: 0
    }));
    journalComptable.forEach(j => rows.push(j));
    return rows.sort((a,b) => String(b.date_operation || "").localeCompare(String(a.date_operation || "")));
  }, [ventes, achats, depenses, paiements, journalComptable, produits]);

  const journalFiltresPro = useMemo(() => {
    const q = journalSearch.trim().toLowerCase();
    return ecrituresAuto.filter((j) => {
      const date = String(j.date_operation || "");
      const matchDate = (!journalDateDebut || date >= journalDateDebut) && (!journalDateFin || date <= journalDateFin);
      const matchType = journalTypeFilter === "tous" || String(j.type_operation || "") === journalTypeFilter;
      const matchSearch = !q || [j.type_operation, j.reference, j.description, j.debit, j.credit].some(v => String(v || "").toLowerCase().includes(q));
      return matchDate && matchType && matchSearch;
    });
  }, [ecrituresAuto, journalSearch, journalDateDebut, journalDateFin, journalTypeFilter]);
  const pagesJournal = Math.max(1, Math.ceil(journalFiltresPro.length / lignesParPagePro));
  const journalPageRows = journalFiltresPro.slice((journalPage - 1) * lignesParPagePro, journalPage * lignesParPagePro);

  const totalDebitComptable = useMemo(() => ecrituresAuto.reduce((s, e) => s + Number(e.debit || 0), 0), [ecrituresAuto]);
  const totalCreditComptable = useMemo(() => ecrituresAuto.reduce((s, e) => s + Number(e.credit || 0), 0), [ecrituresAuto]);
  const resultatMensuel = useMemo(() => ca - achatsTotal - depTotal, [ca, achatsTotal, depTotal]);

  const dateStr = (d) => d.toISOString().slice(0, 10);
  const debutJour = today();
  const debutSemaine = useMemo(() => {
    const d = new Date();
    const day = d.getDay() || 7;
    d.setDate(d.getDate() - day + 1);
    return dateStr(d);
  }, []);
  const debutAnnee = useMemo(() => `${new Date().getFullYear()}-01-01`, []);

  const sommeVentesPeriode = useCallback((debut, fin = today()) =>
    ventes.filter(v => v.date_vente >= debut && v.date_vente <= fin)
      .reduce((s, v) => s + Number(v.quantite || 0) * Number(v.prix_unitaire || 0), 0), [ventes]);

  const sommeAchatsPeriode = useCallback((debut, fin = today()) =>
    achats.filter(a => a.date_achat >= debut && a.date_achat <= fin)
      .reduce((s, a) => s + Number(a.quantite || 0) * Number(a.prix_unitaire || 0), 0), [achats]);

  const sommeDepensesPeriode = useCallback((debut, fin = today()) =>
    depenses.filter(d => d.date_depense >= debut && d.date_depense <= fin)
      .reduce((s, d) => s + Number(d.montant || 0), 0), [depenses]);

  const resumeFinancier = useMemo(() => {
    const periodes = [
      ["Aujourd'hui", debutJour],
      ["Cette semaine", debutSemaine],
      ["Ce mois", debutDuMois()],
      ["Cette année", debutAnnee]
    ];
    return periodes.map(([label, debut]) => {
      const ventesP = sommeVentesPeriode(debut);
      const achatsP = sommeAchatsPeriode(debut);
      const depensesP = sommeDepensesPeriode(debut);
      return {
        label,
        ventes: ventesP,
        achats: achatsP,
        depenses: depensesP,
        resultat: ventesP - achatsP - depensesP
      };
    });
  }, [debutJour, debutSemaine, debutAnnee, sommeVentesPeriode, sommeAchatsPeriode, sommeDepensesPeriode]);

  const resultatJournalier = resumeFinancier[0]?.resultat || 0;
  const resultatHebdo = resumeFinancier[1]?.resultat || 0;
  const resultatAnnuel = resumeFinancier[3]?.resultat || 0;

  const tresorerieDisponible = useMemo(() => soldeCaisses + soldeBanques, [soldeCaisses, soldeBanques]);

  const balanceComptable = useMemo(() => {
    const comptes = [
      { compte: "Ventes", debit: 0, credit: ca },
      { compte: "Achats", debit: achatsTotal, credit: 0 },
      { compte: "Dépenses", debit: depTotal, credit: 0 },
      { compte: "Caisse", debit: soldeCaisses, credit: 0 },
      { compte: "Banque", debit: soldeBanques, credit: 0 },
      { compte: "Créances clients", debit: totalCreances, credit: 0 },
      { compte: "Dettes fournisseurs", debit: 0, credit: totalDettes }
    ];
    return comptes.map(c => ({ ...c, solde: Number(c.debit || 0) - Number(c.credit || 0) }));
  }, [ca, achatsTotal, depTotal, soldeCaisses, soldeBanques, totalCreances, totalDettes]);

  async function saveJournalComptable(e) {
    e.preventDefault();
    if (!journalForm.description.trim()) return setMessage("Veuillez renseigner la description.");
    const debit = Number(journalForm.debit || 0);
    const credit = Number(journalForm.credit || 0);
    if (debit <= 0 && credit <= 0) return setMessage("Veuillez saisir un débit ou un crédit.");
    const { error } = await supabase.from("journal_comptable").insert({
      entreprise_id: entreprise.id,
      type_operation: journalForm.type_operation,
      reference: journalForm.reference || null,
      description: journalForm.description,
      debit,
      credit,
      utilisateur_id: profil.id
    });
    if (error) return showError(error, "Impossible d'enregistrer l'écriture comptable.");
    setJournalForm({ type_operation: "ajustement", reference: "", description: "", debit: "", credit: "" });
    setMessage("Écriture comptable enregistrée.");
    chargerDonnees();
  }


  const inPeriode = useCallback((dateStr) => {
    if (!dateStr) return true;
    return dateStr >= rapportDebut && dateStr <= rapportFin;
  }, [rapportDebut, rapportFin]);

  const rapportVentes = useMemo(() => ventes.filter(v => inPeriode(v.date_vente)).map(v => {
    const p = produits.find(x => x.id === v.produit_id);
    const c = clients.find(x => x.id === v.client_id);
    return {
      date: v.date_vente,
      reference: factureReference(v),
      client: c?.nom || "Client non renseigné",
      produit: p?.nom || "—",
      quantite: Number(v.quantite || 0),
      prix: Number(v.prix_unitaire || 0),
      total: Number(v.quantite || 0) * Number(v.prix_unitaire || 0),
      statut: v.statut || "validée",
      paiement: v.mode_paiement || "—"
    };
  }), [ventes, produits, clients, inPeriode]);

  const rapportAchats = useMemo(() => achats.filter(a => inPeriode(a.date_achat)).map(a => {
    const p = produits.find(x => x.id === a.produit_id);
    const f = fournisseurs.find(x => x.id === a.fournisseur_id);
    return {
      date: a.date_achat,
      fournisseur: f?.nom || "—",
      produit: p?.nom || "—",
      quantite: Number(a.quantite || 0),
      prix: Number(a.prix_unitaire || 0),
      total: Number(a.quantite || 0) * Number(a.prix_unitaire || 0)
    };
  }), [achats, produits, fournisseurs, inPeriode]);

  const rapportDepenses = useMemo(() => depenses.filter(d => inPeriode(d.date_depense)).map(d => ({
    date: d.date_depense,
    categorie: d.categorie,
    description: d.description || "—",
    montant: Number(d.montant || 0)
  })), [depenses, inPeriode]);

  const rapportStocks = useMemo(() => produits.map(p => {
    const cat = categories.find(c => c.id === p.categorie_id);
    return ({
    code: p.code_produit || codeCourt("PRD", p.id),
    produit: p.nom,
    categorie: cat?.nom || "Non classé",
    quantite: Number(p.quantite || 0),
    seuil: Number(p.seuil_alerte || 0),
    prixAchat: Number(p.prix_achat || 0),
    prixVente: Number(p.prix_vente || 0),
    valeur: Number(p.quantite || 0) * Number(p.prix_achat || 0),
    statut: Number(p.quantite || 0) <= Number(p.seuil_alerte || 0) ? "Stock bas" : "OK"
  });
  }), [produits, categories]);

  const rapportCreancesDettes = useMemo(() => [
    ...creances.map(c => {
      const cl = clients.find(x => x.id === c.client_id);
      return { type: "Créance client", tiers: cl?.nom || "—", montant: Number(c.montant || 0), echeance: c.date_echeance || "—", statut: c.statut || "impaye" };
    }),
    ...dettes.map(d => {
      const f = fournisseurs.find(x => x.id === d.fournisseur_id);
      return { type: "Dette fournisseur", tiers: f?.nom || "—", montant: Number(d.montant || 0), echeance: d.date_echeance || "—", statut: d.statut || "impaye" };
    })
  ], [creances, dettes, clients, fournisseurs]);

  const rapportCourant = useMemo(() => {
    if (rapportType === "ventes") return rapportVentes;
    if (rapportType === "achats") return rapportAchats;
    if (rapportType === "depenses") return rapportDepenses;
    if (rapportType === "stocks") return rapportStocks;
    return rapportCreancesDettes;
  }, [rapportType, rapportVentes, rapportAchats, rapportDepenses, rapportStocks, rapportCreancesDettes]);

  const rapportFiltrePro = useMemo(() => {
    const q = rapportSearch.trim().toLowerCase();
    if (!q) return rapportCourant;
    return rapportCourant.filter((r) => Object.values(r).some(v => String(v ?? "").toLowerCase().includes(q)));
  }, [rapportCourant, rapportSearch]);
  const pagesRapport = Math.max(1, Math.ceil(rapportFiltrePro.length / lignesParPagePro));
  const rapportPageRows = rapportFiltrePro.slice((rapportPage - 1) * lignesParPagePro, rapportPage * lignesParPagePro);

  const totalRapport = useMemo(() => rapportCourant.reduce((s, r) => s + Number(r.total ?? r.montant ?? r.valeur ?? 0), 0), [rapportCourant]);

  function exporterRapportCSV() {
    if (rapportType === "ventes") {
      return downloadCSV("rapport_ventes.csv", ["Date", "Référence", "Client", "Produit", "Qté", "PU", "Total", "Statut", "Paiement"], rapportVentes.map(r => [r.date, r.reference, r.client, r.produit, r.quantite, r.prix, r.total, r.statut, r.paiement]));
    }
    if (rapportType === "achats") {
      return downloadCSV("rapport_achats.csv", ["Date", "Fournisseur", "Produit", "Qté", "PU", "Total"], rapportAchats.map(r => [r.date, r.fournisseur, r.produit, r.quantite, r.prix, r.total]));
    }
    if (rapportType === "depenses") {
      return downloadCSV("rapport_depenses.csv", ["Date", "Catégorie", "Description", "Montant"], rapportDepenses.map(r => [r.date, r.categorie, r.description, r.montant]));
    }
    if (rapportType === "stocks") {
      return downloadCSV("rapport_stocks.csv", ["Code", "Produit", "Quantité", "Seuil", "Prix achat", "Prix vente", "Valeur", "Statut"], rapportStocks.map(r => [r.code, r.produit, r.quantite, r.seuil, r.prixAchat, r.prixVente, r.valeur, r.statut]));
    }
    return downloadCSV("rapport_creances_dettes.csv", ["Type", "Tiers", "Montant", "Échéance", "Statut"], rapportCreancesDettes.map(r => [r.type, r.tiers, r.montant, r.echeance, r.statut]));
  }

  function imprimerRapport() {
    const titre = {
      ventes: "Rapport des ventes",
      achats: "Rapport des achats",
      depenses: "Rapport des dépenses",
      stocks: "Rapport de stock",
      creances_dettes: "Rapport créances & dettes"
    }[rapportType];

    const headers = rapportType === "ventes" ? ["Date", "Référence", "Client", "Produit", "Qté", "Total"] :
      rapportType === "achats" ? ["Date", "Fournisseur", "Produit", "Qté", "Total"] :
      rapportType === "depenses" ? ["Date", "Catégorie", "Description", "Montant"] :
      rapportType === "stocks" ? ["Code", "Produit", "Qté", "Valeur", "Statut"] :
      ["Type", "Tiers", "Montant", "Échéance", "Statut"];

    const rows = rapportCourant.map(r => {
      if (rapportType === "ventes") return [r.date, r.reference, r.client, r.produit, r.quantite, fmt(r.total)];
      if (rapportType === "achats") return [r.date, r.fournisseur, r.produit, r.quantite, fmt(r.total)];
      if (rapportType === "depenses") return [r.date, r.categorie, r.description, fmt(r.montant)];
      if (rapportType === "stocks") return [r.code, r.produit, r.quantite, fmt(r.valeur), r.statut];
      return [r.type, r.tiers, fmt(r.montant), r.echeance, r.statut];
    });

    const html = `<html><head><title>${safeText(titre)}</title><style>body{font-family:Arial;margin:0;background:#f4f4f4;color:#152238}.page{width:900px;margin:24px auto;background:white;padding:36px;border-radius:12px}.head{display:flex;justify-content:space-between;border-bottom:4px solid #1E7F6E;padding-bottom:16px;margin-bottom:20px}h1{margin:0}.muted{color:#5b6472;font-size:13px}table{width:100%;border-collapse:collapse;margin-top:16px}th{background:#152238;color:white;text-align:left;padding:10px;font-size:12px}td{border-bottom:1px solid #e8eaee;padding:9px;font-size:13px}.total{text-align:right;font-size:22px;color:#1E7F6E;font-weight:bold;margin-top:22px}@media print{body{background:#fff}.page{width:auto;margin:0;border-radius:0}}</style></head><body><div class="page"><div class="head"><div><h1>${safeText(titre)}</h1><div class="muted">${safeText(entreprise?.nom || "Suivi PME")}<br/>Période : ${safeText(rapportDebut)} au ${safeText(rapportFin)}</div></div><div class="muted">${new Date().toLocaleDateString("fr-FR")}</div></div><table><thead><tr>${headers.map(h=>`<th>${safeText(h)}</th>`).join("")}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${safeText(v)}</td>`).join("")}</tr>`).join("")}</tbody></table><div class="total">Total : ${safeText(fmt(totalRapport))}</div></div><script>window.print()</script></body></html>`;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
  }



  const totalSalairesMois = useMemo(() => salaires
    .filter(s => s.mois === new Date().toISOString().slice(0,7))
    .reduce((sum, s) => sum + Number(s.net_a_payer || 0), 0), [salaires]);

  const totalAvancesMois = useMemo(() => avancesSalaires
    .filter(a => String(a.date_avance || "").slice(0,7) === new Date().toISOString().slice(0,7))
    .reduce((sum, a) => sum + Number(a.montant || 0), 0), [avancesSalaires]);

  const presencesJour = useMemo(() => presences.filter(p => p.date_presence === today()).length, [presences]);
  const congesEnAttente = useMemo(() => conges.filter(c => c.statut === "en_attente").length, [conges]);


  const employesFiltresPro = useMemo(() => {
    const q = employesSearch.trim().toLowerCase();
    return employes.filter((emp) => {
      const matchStatut = employesStatutFilter === "tous" || emp.statut === employesStatutFilter;
      const matchSearch = !q || [emp.nom_complet, emp.telephone, emp.email, emp.poste, emp.salaire_base].some(v => String(v || "").toLowerCase().includes(q));
      return matchStatut && matchSearch;
    });
  }, [employes, employesSearch, employesStatutFilter]);
  const pagesEmployes = Math.max(1, Math.ceil(employesFiltresPro.length / lignesParPagePro));
  const employesPageRows = employesFiltresPro.slice((employesPage - 1) * lignesParPagePro, employesPage * lignesParPagePro);

  const presencesFiltresPro = useMemo(() => {
    const q = presencesSearch.trim().toLowerCase();
    return presences.filter((p) => {
      const emp = employes.find(e => e.id === p.employe_id);
      const date = String(p.date_presence || "");
      const matchDate = (!presencesDateDebut || date >= presencesDateDebut) && (!presencesDateFin || date <= presencesDateFin);
      const matchStatut = presencesStatutFilter === "tous" || p.statut === presencesStatutFilter;
      const matchSearch = !q || [emp?.nom_complet, p.statut, p.note, p.heure_arrivee, p.heure_depart].some(v => String(v || "").toLowerCase().includes(q));
      return matchDate && matchStatut && matchSearch;
    });
  }, [presences, employes, presencesSearch, presencesDateDebut, presencesDateFin, presencesStatutFilter]);
  const pagesPresences = Math.max(1, Math.ceil(presencesFiltresPro.length / lignesParPagePro));
  const presencesPageRows = presencesFiltresPro.slice((presencesPage - 1) * lignesParPagePro, presencesPage * lignesParPagePro);

  const avancesFiltresPro = useMemo(() => {
    const q = avancesSearch.trim().toLowerCase();
    return avancesSalaires.filter((a) => {
      const emp = employes.find(e => e.id === a.employe_id);
      return !q || [emp?.nom_complet, a.date_avance, a.motif, a.montant, a.mode_paiement].some(v => String(v || "").toLowerCase().includes(q));
    });
  }, [avancesSalaires, employes, avancesSearch]);
  const pagesAvances = Math.max(1, Math.ceil(avancesFiltresPro.length / lignesParPagePro));
  const avancesPageRows = avancesFiltresPro.slice((avancesPage - 1) * lignesParPagePro, avancesPage * lignesParPagePro);

  const salairesFiltresPro = useMemo(() => {
    const q = salairesSearch.trim().toLowerCase();
    return salaires.filter((s) => {
      const emp = employes.find(e => e.id === s.employe_id);
      return !q || [emp?.nom_complet, s.mois, s.statut, s.net_a_payer, s.mode_paiement].some(v => String(v || "").toLowerCase().includes(q));
    });
  }, [salaires, employes, salairesSearch]);
  const pagesSalaires = Math.max(1, Math.ceil(salairesFiltresPro.length / lignesParPagePro));
  const salairesPageRows = salairesFiltresPro.slice((salairesPage - 1) * lignesParPagePro, salairesPage * lignesParPagePro);

  const congesFiltresPro = useMemo(() => {
    const q = congesSearch.trim().toLowerCase();
    return conges.filter((c) => {
      const emp = employes.find(e => e.id === c.employe_id);
      return !q || [emp?.nom_complet, c.date_debut, c.date_fin, c.type_conge, c.statut, c.motif].some(v => String(v || "").toLowerCase().includes(q));
    });
  }, [conges, employes, congesSearch]);
  const pagesConges = Math.max(1, Math.ceil(congesFiltresPro.length / lignesParPagePro));
  const congesPageRows = congesFiltresPro.slice((congesPage - 1) * lignesParPagePro, congesPage * lignesParPagePro);

  async function saveEmploye(e) {
    // saveEmploye_pme_required_v694
    if (isSuperAdmin && !getEntrepriseSystemeId()) return setMessage("Entreprise système ENT-SUPER introuvable. Exécutez le script SQL V6.9.6.");

    e.preventDefault();
    if (!employeForm.nom_complet.trim()) return setMessage("Veuillez renseigner le nom complet.");
    const payload = {
      created_by: profil.id,
      nom_complet: employeForm.nom_complet.trim(),
      telephone: employeForm.telephone ? `+221 ${String(employeForm.telephone).replace(/^\\+221\\s?/, "")}` : null,
      email: employeForm.email || null,
      poste: employeForm.poste || null,
      salaire_base: Number(employeForm.salaire_base || 0),
      date_embauche: employeForm.date_embauche || today(),
      statut: employeForm.statut || "actif"
    };
    const res = employeForm.id
      ? await supabase.from("employes").update(payload).eq("id", employeForm.id)
      : await supabase.from("employes").insert(payload);
    if (res.error) return showError(res.error, "Impossible d'enregistrer l'employé.");
    setEmployeForm({ id: null, nom_complet: "", telephone: "", email: "", poste: "", salaire_base: "", date_embauche: today(), statut: "actif" });
    setMessage("Employé enregistré.");
    chargerDonnees();
  }

  async function savePresence(e) {
    e.preventDefault();
    if (!presenceForm.employe_id) return setMessage("Veuillez sélectionner un employé.");
    const { error } = await supabase.from("presences").insert({
      entreprise_id: entreprise.id,
      employe_id: presenceForm.employe_id,
      date_presence: presenceForm.date_presence || today(),
      statut: presenceForm.statut,
      heure_arrivee: presenceForm.heure_arrivee || null,
      heure_depart: presenceForm.heure_depart || null,
      note: presenceForm.note || null
    });
    if (error) return showError(error, "Impossible d'enregistrer la présence.");
    setPresenceForm({ employe_id: employes[0]?.id || "", date_presence: today(), statut: "present", heure_arrivee: "", heure_depart: "", note: "" });
    setMessage("Présence enregistrée.");
    chargerDonnees();
  }

  async function saveAvanceSalaire(e) {
    e.preventDefault();
    if (!avanceForm.employe_id || Number(avanceForm.montant || 0) <= 0) return setMessage("Veuillez sélectionner un employé et saisir un montant.");
    const { error } = await supabase.from("avances_salaires").insert({
      entreprise_id: entreprise.id,
      employe_id: avanceForm.employe_id,
      montant: Number(avanceForm.montant || 0),
      date_avance: avanceForm.date_avance || today(),
      motif: avanceForm.motif || null
    });
    if (error) return showError(error, "Impossible d'enregistrer l'avance.");
    setAvanceForm({ employe_id: employes[0]?.id || "", montant: "", date_avance: today(), motif: "" });
    setMessage("Avance enregistrée.");
    chargerDonnees();
  }

  async function saveSalaire(e) {
    e.preventDefault();
    const emp = employes.find(x => x.id === salaireForm.employe_id);
    if (!emp) return setMessage("Veuillez sélectionner un employé.");
    const mois = salaireForm.mois || new Date().toISOString().slice(0,7);
    const avances = avancesSalaires
      .filter(a => a.employe_id === emp.id && String(a.date_avance || "").slice(0,7) === mois)
      .reduce((s, a) => s + Number(a.montant || 0), 0);
    const salaireBase = Number(emp.salaire_base || 0);
    const primes = Number(salaireForm.primes || 0);
    const retenues = Number(salaireForm.retenues || 0);
    const net = salaireBase + primes - retenues - avances;
    const { error } = await supabase.from("salaires").insert({
      entreprise_id: entreprise.id,
      employe_id: emp.id,
      mois,
      salaire_base: salaireBase,
      avances,
      primes,
      retenues,
      net_a_payer: net,
      statut: "non_paye"
    });
    if (error) return showError(error, "Impossible de générer le salaire.");
    setSalaireForm({ employe_id: employes[0]?.id || "", mois: new Date().toISOString().slice(0,7), primes: "", retenues: "" });
    setMessage("Salaire généré.");
    chargerDonnees();
  }

  async function saveConge(e) {
    e.preventDefault();
    if (!congeForm.employe_id) return setMessage("Veuillez sélectionner un employé.");
    const { error } = await supabase.from("conges").insert({
      entreprise_id: entreprise.id,
      employe_id: congeForm.employe_id,
      date_debut: congeForm.date_debut,
      date_fin: congeForm.date_fin,
      type_conge: congeForm.type_conge,
      statut: congeForm.statut,
      motif: congeForm.motif || null
    });
    if (error) return showError(error, "Impossible d'enregistrer le congé.");
    setCongeForm({ employe_id: employes[0]?.id || "", date_debut: today(), date_fin: today(), type_conge: "annuel", statut: "en_attente", motif: "" });
    setMessage("Congé enregistré.");
    chargerDonnees();
  }

  async function changerStatutSalaire(id, statut) {
    const { error } = await supabase.from("salaires").update({ statut }).eq("id", id);
    if (error) return showError(error, "Impossible de modifier le salaire.");
    chargerDonnees();
  }

  async function changerStatutConge(id, statut) {
    const { error } = await supabase.from("conges").update({ statut }).eq("id", id);
    if (error) return showError(error, "Impossible de modifier le congé.");
    chargerDonnees();
  }

  function imprimerBulletin(salaire) {
    const emp = employes.find(e => e.id === salaire.employe_id);
    const html = `<html><head><title>Bulletin ${safeText(emp?.nom_complet || "")}</title><style>body{font-family:Arial;background:#f4f4f4;color:#152238}.page{width:800px;margin:24px auto;background:#fff;padding:36px;border-radius:12px}.head{display:flex;justify-content:space-between;border-bottom:4px solid #1E7F6E;padding-bottom:16px}table{width:100%;border-collapse:collapse;margin-top:24px}td,th{padding:12px;border-bottom:1px solid #e8eaee;text-align:left}.total{font-size:24px;color:#1E7F6E;font-weight:bold;text-align:right;margin-top:24px}@media print{body{background:#fff}.page{margin:0;width:auto}}</style></head><body><div class="page"><div class="head"><div><h1>${safeText(entreprise?.nom || "Suivi PME")}</h1><div>Bulletin de salaire — ${safeText(salaire.mois)}</div></div><div>${new Date().toLocaleDateString("fr-FR")}</div></div><h2>${safeText(emp?.nom_complet || "Employé")}</h2><div>Poste : ${safeText(emp?.poste || "—")}</div><table><tr><th>Élément</th><th>Montant</th></tr><tr><td>Salaire de base</td><td>${safeText(fmt(salaire.salaire_base))}</td></tr><tr><td>Primes</td><td>${safeText(fmt(salaire.primes))}</td></tr><tr><td>Avances</td><td>${safeText(fmt(salaire.avances))}</td></tr><tr><td>Retenues</td><td>${safeText(fmt(salaire.retenues))}</td></tr></table><div class="total">Net à payer : ${safeText(fmt(salaire.net_a_payer))}</div><br/><br/><div style="text-align:right">Signature / Cachet</div></div><script>window.print()</script></body></html>`;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
  }


  const prospectsActifs = useMemo(() => prospects.filter(p => !["converti","perdu"].includes(p.statut)).length, [prospects]);
  const relancesAujourdhui = useMemo(() => relances.filter(r => r.date_relance <= today() && r.statut !== "faite").length, [relances]);
  const campagnesActives = useMemo(() => campagnes.filter(c => c.statut !== "terminee").length, [campagnes]);

  async function saveProspect(e) {
    e.preventDefault();
    if (!prospectForm.nom.trim()) return setMessage("Veuillez renseigner le nom du prospect.");
    const payload = {
      entreprise_id: entreprise.id,
      nom: prospectForm.nom.trim(),
      telephone: prospectForm.telephone ? `+221 ${String(prospectForm.telephone).replace(/^\\+221\\s?/, "")}` : null,
      email: prospectForm.email || null,
      source: prospectForm.source || null,
      statut: prospectForm.statut,
      note: prospectForm.note || null
    };
    const res = prospectForm.id
      ? await supabase.from("prospects").update(payload).eq("id", prospectForm.id)
      : await supabase.from("prospects").insert(payload);
    if (res.error) return showError(res.error, "Impossible d'enregistrer le prospect.");
    setProspectForm({ id: null, nom: "", telephone: "", email: "", source: "", statut: "nouveau", note: "" });
    setMessage("Prospect enregistré.");
    chargerDonnees();
  }

  async function convertirProspectClient(p) {
    const { error } = await supabase.from("clients").insert({
      entreprise_id: entreprise.id,
      nom: p.nom,
      telephone: p.telephone || null,
      email: p.email || null,
      adresse: null,
      code_client: `CLI-${String(Date.now()).slice(-6)}`
    });
    if (error) return showError(error, "Impossible de convertir en client.");
    await supabase.from("prospects").update({ statut: "converti" }).eq("id", p.id);
    setMessage("Prospect converti en client.");
    chargerDonnees();
  }

  async function saveInteraction(e) {
    e.preventDefault();
    if (!interactionForm.client_id && !interactionForm.prospect_id) return setMessage("Veuillez sélectionner un client ou un prospect.");
    const { error } = await supabase.from("interactions_clients").insert({
      entreprise_id: entreprise.id,
      client_id: interactionForm.client_id || null,
      prospect_id: interactionForm.prospect_id || null,
      type_interaction: interactionForm.type_interaction,
      message: interactionForm.message || null,
      date_interaction: interactionForm.date_interaction || today()
    });
    if (error) return showError(error, "Impossible d'enregistrer l'interaction.");
    setInteractionForm({ client_id: "", prospect_id: "", type_interaction: "appel", message: "", date_interaction: today() });
    setMessage("Interaction enregistrée.");
    chargerDonnees();
  }

  async function saveCampagne(e) {
    e.preventDefault();
    if (!campagneForm.nom.trim()) return setMessage("Veuillez renseigner le nom de la campagne.");
    const { error } = await supabase.from("campagnes").insert({
      entreprise_id: entreprise.id,
      nom: campagneForm.nom.trim(),
      canal: campagneForm.canal,
      message: campagneForm.message || null,
      statut: campagneForm.statut
    });
    if (error) return showError(error, "Impossible d'enregistrer la campagne.");
    setCampagneForm({ nom: "", canal: "whatsapp", message: "", statut: "brouillon" });
    setMessage("Campagne enregistrée.");
    chargerDonnees();
  }

  async function saveRelance(e) {
    e.preventDefault();
    if (!relanceForm.client_id && !relanceForm.prospect_id) return setMessage("Veuillez sélectionner un client ou un prospect.");
    const { error } = await supabase.from("relances").insert({
      entreprise_id: entreprise.id,
      client_id: relanceForm.client_id || null,
      prospect_id: relanceForm.prospect_id || null,
      objet: relanceForm.objet || null,
      date_relance: relanceForm.date_relance,
      statut: relanceForm.statut,
      note: relanceForm.note || null
    });
    if (error) return showError(error, "Impossible d'enregistrer la relance.");
    setRelanceForm({ client_id: "", prospect_id: "", objet: "", date_relance: today(), statut: "a_faire", note: "" });
    setMessage("Relance enregistrée.");
    chargerDonnees();
  }

  async function marquerRelanceFaite(id) {
    const { error } = await supabase.from("relances").update({ statut: "faite" }).eq("id", id);
    if (error) return showError(error, "Impossible de modifier la relance.");
    chargerDonnees();
  }

  function ouvrirWhatsApp(numero, message) {
    const clean = String(numero || "").replace(/[^0-9]/g, "");
    if (!clean) return setMessage("Numéro WhatsApp manquant.");
    const phone = clean.startsWith("221") ? clean : `221${clean}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message || "")}`, "_blank");
  }

  function copierCampagne(c) {
    navigator.clipboard?.writeText(c.message || "");
    setMessage("Message de campagne copié.");
  }


  const topProduits = useMemo(() => {
    const map = {};
    ventes.forEach(v => {
      const p = produits.find(x => x.id === v.produit_id);
      const nom = p?.nom || "Produit inconnu";
      const total = Number(v.quantite || 0) * Number(v.prix_unitaire || 0);
      map[nom] = map[nom] || { nom, quantite: 0, ca: 0 };
      map[nom].quantite += Number(v.quantite || 0);
      map[nom].ca += total;
    });
    return Object.values(map).sort((a,b) => b.ca - a.ca).slice(0, 10);
  }, [ventes, produits]);

  const topClients = useMemo(() => {
    const map = {};
    ventes.forEach(v => {
      const c = clients.find(x => x.id === v.client_id);
      const nom = c?.nom || "Client non renseigné";
      const total = Number(v.quantite || 0) * Number(v.prix_unitaire || 0);
      map[nom] = map[nom] || { nom, ca: 0, factures: 0 };
      map[nom].ca += total;
      map[nom].factures += 1;
    });
    return Object.values(map).sort((a,b) => b.ca - a.ca).slice(0, 10);
  }, [ventes, clients]);

  const ventesParJour = useMemo(() => {
    const map = {};
    ventes.forEach(v => {
      const d = v.date_vente || today();
      map[d] = (map[d] || 0) + Number(v.quantite || 0) * Number(v.prix_unitaire || 0);
    });
    return Object.entries(map).sort(([a],[b]) => a.localeCompare(b)).map(([date, montant]) => ({ date, montant }));
  }, [ventes]);

  const moyenneVentesJour = useMemo(() => {
    if (!ventesParJour.length) return 0;
    return ventesParJour.reduce((s, x) => s + Number(x.montant || 0), 0) / ventesParJour.length;
  }, [ventesParJour]);

  const previsionCA30 = useMemo(() => moyenneVentesJour * 30, [moyenneVentesJour]);
  const previsionCA60 = useMemo(() => moyenneVentesJour * 60, [moyenneVentesJour]);
  const previsionCA90 = useMemo(() => moyenneVentesJour * 90, [moyenneVentesJour]);

  const previsionVentesGraph = useMemo(() => [
    { periode: "30 jours", montant: previsionCA30 },
    { periode: "60 jours", montant: previsionCA60 },
    { periode: "90 jours", montant: previsionCA90 }
  ], [previsionCA30, previsionCA60, previsionCA90]);

  const stockPredictions = useMemo(() => produits.map(p => {
    const ventesProduit = ventes.filter(v => v.produit_id === p.id);
    const totalVendu = ventesProduit.reduce((s, v) => s + Number(v.quantite || 0), 0);
    const jours = Math.max(ventesParJour.length, 1);
    const moyenneJour = totalVendu / jours;
    const stock = Number(p.quantite || 0);
    const joursRestants = moyenneJour > 0 ? Math.floor(stock / moyenneJour) : null;
    const quantiteRecommandee = moyenneJour > 0 ? Math.ceil(moyenneJour * 30) : 0;
    return {
      produit: p.nom,
      stock,
      moyenneJour,
      joursRestants,
      quantiteRecommandee,
      statut: joursRestants !== null && joursRestants <= 7 ? "Risque rupture" : stock <= Number(p.seuil_alerte || 0) ? "Stock bas" : "OK"
    };
  }).sort((a,b) => (a.joursRestants ?? 9999) - (b.joursRestants ?? 9999)), [produits, ventes, ventesParJour]);

  const anomaliesAuto = useMemo(() => {
    const rows = [];
    produits.forEach(p => {
      if (Number(p.quantite || 0) < 0) rows.push({ niveau: "élevé", type: "Stock négatif", description: `${p.nom} a un stock négatif.` });
      if (Number(p.prix_vente || 0) < Number(p.prix_achat || 0)) rows.push({ niveau: "élevé", type: "Vente à perte", description: `${p.nom} est vendu sous le prix d'achat.` });
      if (Number(p.quantite || 0) <= Number(p.seuil_alerte || 0)) rows.push({ niveau: "moyen", type: "Stock faible", description: `${p.nom} est sous le seuil d'alerte.` });
    });
    depenses.forEach(d => {
      if (Number(d.montant || 0) > depTotal * 0.5 && depTotal > 0) rows.push({ niveau: "moyen", type: "Dépense inhabituelle", description: `${d.categorie} : ${fmt(d.montant)} représente une dépense élevée.` });
    });
    creances.forEach(c => {
      if (c.date_echeance && c.date_echeance < today() && c.statut !== "paye") rows.push({ niveau: "élevé", type: "Créance en retard", description: `Une créance de ${fmt(c.montant)} est en retard.` });
    });
    dettes.forEach(d => {
      if (d.date_echeance && d.date_echeance < today() && d.statut !== "paye") rows.push({ niveau: "moyen", type: "Dette en retard", description: `Une dette de ${fmt(d.montant)} est en retard.` });
    });
    salaires.forEach(s => {
      if (s.statut !== "paye") rows.push({ niveau: "faible", type: "Salaire non payé", description: `Salaire ${s.mois} non payé.` });
    });
    return rows;
  }, [produits, depenses, depTotal, creances, dettes, salaires]);

  const scoreSante = useMemo(() => {
    let score = 100;
    if (resultatMensuel < 0) score -= 25;
    if (totalCreances > ca * 0.5 && ca > 0) score -= 15;
    if (totalDettes > ca * 0.5 && ca > 0) score -= 15;
    if (produitsAlerte.length > 0) score -= Math.min(20, produitsAlerte.length * 3);
    if (anomaliesAuto.length > 0) score -= Math.min(20, anomaliesAuto.length * 4);
    return Math.max(0, Math.min(100, score));
  }, [resultatMensuel, totalCreances, totalDettes, ca, produitsAlerte.length, anomaliesAuto.length]);

  const suggestionsIA = useMemo(() => {
    const s = [];
    stockPredictions.filter(p => p.statut !== "OK").slice(0, 5).forEach(p => s.push(`Réapprovisionner ${p.produit} : quantité recommandée ${p.quantiteRecommandee}.`));
    if (totalCreances > 0) s.push(`Relancer les clients : ${fmt(totalCreances)} de créances ouvertes.`);
    if (resultatMensuel < 0) s.push("Réduire les dépenses ou augmenter la marge : résultat mensuel négatif.");
    if (scoreSante >= 80) s.push("La santé financière est bonne. Maintenir le suivi des stocks et créances.");
    return s.slice(0, 8);
  }, [stockPredictions, totalCreances, resultatMensuel, scoreSante]);

  async function genererPrevisionsDataIA() {
    const rowsVentes = [30, 60, 90].map((j) => {
      const d = new Date();
      d.setDate(d.getDate() + j);
      return { entreprise_id: entreprise.id, date_prevision: d.toISOString().slice(0,10), montant_prevu: moyenneVentesJour * j };
    });
    await supabase.from("previsions_ventes").insert(rowsVentes);

    const rowsStock = stockPredictions.slice(0, 20).map((p, i) => {
      const d = new Date();
      d.setDate(d.getDate() + (p.joursRestants || 30));
      const produit = produits.find(x => x.nom === p.produit);
      return { entreprise_id: entreprise.id, produit_id: produit?.id || null, date_prevision: d.toISOString().slice(0,10), quantite_prevue: p.quantiteRecommandee };
    });
    if (rowsStock.length) await supabase.from("previsions_stock").insert(rowsStock);

    const rowsAnomalies = anomaliesAuto.slice(0, 20).map(a => ({ entreprise_id: entreprise.id, type_anomalie: a.type, description: a.description, niveau: a.niveau, statut: "ouverte" }));
    if (rowsAnomalies.length) await supabase.from("anomalies").insert(rowsAnomalies);

    setMessage("Prévisions et anomalies générées.");
    chargerDonnees();
  }

  async function fermerAnomalie(id) {
    const { error } = await supabase.from("anomalies").update({ statut: "fermee" }).eq("id", id);
    if (error) return showError(error, "Impossible de fermer l'anomalie.");
    chargerDonnees();
  }

  const posteActuel = normalizePoste(profil);
  const posteAffiche = ROLE_LABELS[posteActuel] || posteActuel;
  const can = useCallback((module) => {
    if (isSuperAdmin) return true;
    if (profil?.actif === false) return module === "dashboard";
    const droits = {
      gerant: ["dashboard","ventes","factures","devis","depenses","stocks","achats","clients","fournisseurs","caisse","banque","creances","dettes","utilisateurs","rapports","comptabilite","rh","data_ia","messagerie","abonnement","abonnement","parametres"],
      caissier: ["dashboard","ventes","factures","devis","clients","messagerie","abonnement"],
      magasinier: ["dashboard","stocks","achats","fournisseurs","messagerie","abonnement"],
      comptable: ["dashboard","depenses","caisse","banque","creances","dettes","factures","rapports","comptabilite","rh","data_ia","messagerie","abonnement"],
      employe: ["dashboard","ventes","clients","messagerie","abonnement"]
    };
    return (droits[posteActuel] || droits.employe).includes(module);
  }, [posteActuel, profil?.actif, isSuperAdmin]);

  async function changerPosteUtilisateur(userId, poste) {
    const { error } = await supabase.from("profils").update({ poste }).eq("id", userId);
    if (error) return showError(error, "Impossible de modifier le rôle.");
    setMessage("Rôle utilisateur mis à jour.");
    chargerDonnees();
  }

  const utilisateursFiltres = useMemo(() => {
    const q = utilisateurSearch.trim().toLowerCase();
    return utilisateurs
      .filter((u) => u.entreprise_id === entreprise?.id)
      .filter((u) => !q || String(u.nom_complet || "").toLowerCase().includes(q) || String(u.code_utilisateur || "").toLowerCase().includes(q) || String(u.poste || u.role || "").toLowerCase().includes(q));
  }, [utilisateurs, entreprise?.id, utilisateurSearch]);


  const clientsFiltresPro = useMemo(() => {
    const q = clientsSearch.trim().toLowerCase();
    return clients.filter((c) => !q || [c.nom, c.telephone, c.email, c.adresse, c.code_client].some(v => String(v || "").toLowerCase().includes(q)));
  }, [clients, clientsSearch]);
  const pagesClients = Math.max(1, Math.ceil(clientsFiltresPro.length / lignesParPagePro));
  const clientsPageRows = clientsFiltresPro.slice((clientsPage - 1) * lignesParPagePro, clientsPage * lignesParPagePro);

  const fournisseursFiltresPro = useMemo(() => {
    const q = fournisseursSearch.trim().toLowerCase();
    return fournisseurs.filter((f) => !q || [f.nom, f.telephone, f.email, f.adresse, f.code_fournisseur].some(v => String(v || "").toLowerCase().includes(q)));
  }, [fournisseurs, fournisseursSearch]);
  const pagesFournisseurs = Math.max(1, Math.ceil(fournisseursFiltresPro.length / lignesParPagePro));
  const fournisseursPageRows = fournisseursFiltresPro.slice((fournisseursPage - 1) * lignesParPagePro, fournisseursPage * lignesParPagePro);

  const utilisateursFiltresPro = useMemo(() => {
    return utilisateursFiltres.filter((u) => {
      const role = u.poste || u.role || "employe";
      const actif = u.actif !== false;
      const matchRole = utilisateurRoleFilter === "tous" || role === utilisateurRoleFilter;
      const matchStatut = utilisateurStatutFilter === "tous" || (utilisateurStatutFilter === "actif" ? actif : !actif);
      return matchRole && matchStatut;
    });
  }, [utilisateursFiltres, utilisateurRoleFilter, utilisateurStatutFilter]);
  const pagesUtilisateurs = Math.max(1, Math.ceil(utilisateursFiltresPro.length / lignesParPagePro));
  const utilisateursPageRows = utilisateursFiltresPro.slice((utilisateursPage - 1) * lignesParPagePro, utilisateursPage * lignesParPagePro);

  async function changerStatutUtilisateur(userId, actif) {
    const { error } = await supabase.from("profils").update({ actif }).eq("id", userId);
    if (error) return showError(error, "Impossible de modifier le statut utilisateur.");
    setMessage(actif ? "Utilisateur réactivé." : "Utilisateur désactivé.");
    chargerDonnees();
  }


  function genererMotDePasseTemporaire() {
    return `SuiviPME@${Math.floor(100000 + Math.random() * 900000)}`;
  }

  async function creerUtilisateurDirect(e) {
    // creerUtilisateurDirect_pme_required_v694
    if (isSuperAdmin && !getEntrepriseSystemeId()) return setMessage("Entreprise système ENT-SUPER introuvable. Exécutez le script SQL V6.9.6.");

    // creerUtilisateurDirect_superadmin_only
    if (!isSuperAdmin) return setMessage("La création directe d’utilisateur est réservée au Super Admin. Utilisez la messagerie interne.");

    e.preventDefault();
    // creation_user_security_v682
    if (!entreprise?.id && !profil?.entreprise_id) return setMessage("Entreprise introuvable.");
    if (!newUserForm.nom_complet.trim()) return setMessage("Veuillez renseigner le nom complet.");
    if (!newUserForm.email.trim()) return setMessage("Veuillez renseigner l'email.");
    if (!entreprise?.id) return setMessage("Entreprise introuvable.");

    const password = genererMotDePasseTemporaire();

    const { data, error } = await supabase.functions.invoke("create-user", {
      body: {
        nom_complet: newUserForm.nom_complet.trim(),
        email: newUserForm.email.trim(),
        telephone: newUserForm.telephone ? `+221 ${String(newUserForm.telephone).replace(/^\\+221\\s?/, "")}` : null,
        poste: newUserForm.poste,
        password
      }
    });

    if (error || data?.error) {
      return showError(error || data, data?.error || "Impossible de créer l'utilisateur.");
    }

    setNewUserAccess({
      email: newUserForm.email.trim(),
      password,
      poste: newUserForm.poste,
      nom_complet: newUserForm.nom_complet.trim()
    });

    setNewUserForm({ entreprise_id: "", nom_complet: "", email: "", telephone: "", poste: "employe" });
    setMessage("Utilisateur créé. Copiez ses accès et transmettez-les de manière sécurisée.");
    chargerDonnees();
  }

  async function copierAccesUtilisateur() {
    if (!newUserAccess) return;
    const texte = `Bonjour ${newUserAccess.nom_complet}, votre compte Suivi PME est créé.\\nEmail : ${newUserAccess.email}\\nMot de passe temporaire : ${newUserAccess.password}\\nRôle : ${ROLE_LABELS[newUserAccess.poste] || newUserAccess.poste}\\nMerci de changer votre mot de passe après la première connexion.`;
    await navigator.clipboard?.writeText(texte);
    setMessage("Accès utilisateur copiés.");
  }

  async function copierInvitation(role = "employe") {
    const texte = `Bonjour, vous êtes invité à rejoindre ${entreprise?.nom || "notre entreprise"} sur Suivi PME. Code d'invitation : ${entreprise?.code_invitation}. Rôle prévu : ${ROLE_LABELS[role] || role}.`;
    await navigator.clipboard?.writeText(texte);
    setMessage("Message d'invitation copié.");
  }

  async function savePerson(table, form, setter, empty) {
    if (!entreprise?.id || !form.nom.trim()) return;
    const payload = { entreprise_id: entreprise.id, nom: form.nom.trim(), telephone: form.telephone ? `+221 ${form.telephone}` : null, email: form.email || null, adresse: form.adresse || null };
    if (!form.id && table === "clients") payload.code_client = `CLI-${String(Date.now()).slice(-6)}`;
    if (!form.id && table === "fournisseurs") payload.code_fournisseur = `FOU-${String(Date.now()).slice(-6)}`;
    const res = form.id ? await supabase.from(table).update(payload).eq("id", form.id) : await supabase.from(table).insert(payload);
    if (res.error) return showError(res.error, `Impossible d'enregistrer ${table}.`);
    setter(empty); await chargerDonnees();
  }
  async function deleteRow(table, id) { const { error } = await supabase.from(table).delete().eq("id", id); if (error) showError(error, "Suppression impossible."); else chargerDonnees(); }

  async function saveCategorie(e) {
    e.preventDefault();
    if (!entreprise?.id || !categorieForm.nom.trim()) return;
    const payload = { entreprise_id: entreprise.id, nom: categorieForm.nom.trim() };
    const res = categorieForm.id
      ? await supabase.from("categories").update(payload).eq("id", categorieForm.id)
      : await supabase.from("categories").insert(payload);
    if (res.error) return showError(res.error, "Impossible d'enregistrer la catégorie.");
    setCategorieForm({ id: null, nom: "" });
    chargerDonnees();
  }

  async function saveMouvementStock(e) {
    e.preventDefault();
    const produit = produits.find(p => p.id === mouvementStockForm.produit_id);
    const q = Number(mouvementStockForm.quantite || 0);
    if (!produit || q <= 0) return setMessage("Veuillez sélectionner un produit et une quantité valide.");
    const stockAvant = Number(produit.quantite || 0);
    let stockApres = stockAvant;
    if (["entree", "retour_client"].includes(mouvementStockForm.type_mouvement)) stockApres += q;
    if (["sortie", "retour_fournisseur"].includes(mouvementStockForm.type_mouvement)) stockApres -= q;
    if (mouvementStockForm.type_mouvement === "ajustement") stockApres = q;
    if (stockApres < 0) return setMessage("Stock insuffisant pour ce mouvement.");
    const { error: upErr } = await supabase.from("produits").update({ quantite: stockApres }).eq("id", produit.id);
    if (upErr) return showError(upErr, "Impossible de mettre le stock à jour.");
    const { error } = await supabase.from("mouvements_stock").insert({
      entreprise_id: entreprise.id, produit_id: produit.id, type_mouvement: mouvementStockForm.type_mouvement,
      quantite: q, stock_avant: stockAvant, stock_apres: stockApres, motif: mouvementStockForm.motif || null, utilisateur_id: profil.id
    });
    if (error) return showError(error, "Stock modifié mais mouvement non enregistré.");
    setMouvementStockForm({ produit_id: produits[0]?.id || "", type_mouvement: "entree", quantite: "", motif: "" });
    await addLog("Stock", "Mouvement stock", mouvementStockForm.type_mouvement);
    setMessage("Mouvement de stock enregistré.");
    chargerDonnees();
  }

  async function saveInventaire(e) {
    e.preventDefault();
    const produit = produits.find(p => p.id === inventaireForm.produit_id);
    const stockPhysique = Number(inventaireForm.stock_physique);
    if (!produit || stockPhysique < 0) return setMessage("Veuillez saisir un stock physique valide.");
    const stockSysteme = Number(produit.quantite || 0);
    const ecart = stockPhysique - stockSysteme;
    const { error } = await supabase.from("inventaires").insert({
      entreprise_id: entreprise.id, produit_id: produit.id, stock_systeme: stockSysteme,
      stock_physique: stockPhysique, ecart, utilisateur_id: profil.id
    });
    if (error) return showError(error, "Impossible d'enregistrer l'inventaire.");
    if (ecart !== 0) {
      await supabase.from("produits").update({ quantite: stockPhysique }).eq("id", produit.id);
      await supabase.from("mouvements_stock").insert({
        entreprise_id: entreprise.id, produit_id: produit.id, type_mouvement: "inventaire",
        quantite: Math.abs(ecart), stock_avant: stockSysteme, stock_apres: stockPhysique,
        motif: `Ajustement inventaire : écart ${ecart}`, utilisateur_id: profil.id
      });
    }
    setInventaireForm({ produit_id: produits[0]?.id || "", stock_physique: "" });
    await addLog("Stock", "Inventaire", "Inventaire validé et stock ajusté.");
    setMessage("Inventaire validé et stock ajusté.");
    chargerDonnees();
  }

  async function saveProduit(e) {
    e.preventDefault();
    if (!entreprise?.id || !produitForm.nom.trim()) return;
    const payload = {
      entreprise_id: entreprise.id,
      nom: produitForm.nom.trim(),
      categorie_id: produitForm.categorie_id || null,
      code_barres: produitForm.code_barres || null,
      image_url: produitForm.image_url || null,
      code_produit: produitForm.code_produit || `PRD-${String(Date.now()).slice(-6)}`,
      quantite: Number(produitForm.quantite || 0),
      seuil_alerte: Number(produitForm.seuil_alerte || 0),
      prix_achat: Number(produitForm.prix_achat || 0),
      prix_vente: Number(produitForm.prix_vente || 0)
    };
    const res = produitForm.id ? await supabase.from("produits").update(payload).eq("id", produitForm.id) : await supabase.from("produits").insert(payload);
    if (res.error) return showError(res.error, "Impossible d'enregistrer le produit.");
    setProduitForm(emptyProduit); await chargerDonnees();
  }
  async function saveVente(e) {
    e.preventDefault();

    if (!venteForm.client_id) return setMessage("Veuillez sélectionner un client avant d'enregistrer la vente.");

    const lignesValides = venteLignes
      .map((l) => {
        const p = produits.find((x) => x.id === l.produit_id);
        const q = Number(l.quantite);
        return p && q > 0 ? { produit: p, quantite: q, prix_unitaire: Number(p.prix_vente) } : null;
      })
      .filter(Boolean);

    if (!lignesValides.length) return setMessage("Veuillez ajouter au moins un produit valide.");

    const rupture = lignesValides.find((l) => l.quantite > Number(l.produit.quantite));
    if (rupture) return setMessage(`Stock insuffisant pour : ${rupture.produit.nom}`);

    const baseRef = `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const totalFacture = lignesValides.reduce((s, l) => s + l.quantite * l.prix_unitaire, 0);
    const typeVente = venteForm.type_vente || "comptant";
    const montantPayeGlobal = typeVente === "credit" ? Number(venteForm.montant_paye || 0) : totalFacture;
    const ratioPaiement = totalFacture > 0 ? Math.min(montantPayeGlobal / totalFacture, 1) : 0;

    const ventesPayload = lignesValides.map((l, index) => {
      const totalLigne = l.quantite * l.prix_unitaire;
      const montantPayeLigne = Math.round(totalLigne * ratioPaiement);
      const resteLigne = Math.max(totalLigne - montantPayeLigne, 0);
      return {
        entreprise_id: entreprise.id,
        produit_id: l.produit.id,
        client_id: venteForm.client_id,
        quantite: l.quantite,
        prix_unitaire: l.prix_unitaire,
        utilisateur_id: profil.id,
        reference: baseRef,
        statut: resteLigne <= 0 ? "payée" : "validée",
        mode_paiement: venteForm.mode_paiement || "Espèces",
        type_vente: typeVente,
        montant_paye: montantPayeLigne,
        reste_a_payer: resteLigne,
        date_echeance: typeVente === "credit" ? (venteForm.date_echeance || null) : null
      };
    });

    const { data: ventesCreees, error } = await supabase.from("ventes").insert(ventesPayload).select("*");
    if (error) return showError(error, "Impossible d'enregistrer la vente.");

    const paiementPayload = (ventesCreees || [])
      .filter(v => Number(v.montant_paye || 0) > 0)
      .map(v => ({
        entreprise_id: entreprise.id,
        vente_id: v.id,
        montant: Number(v.montant_paye || 0),
        mode_paiement: venteForm.mode_paiement || "Espèces",
        reference: `PAY-${String(Date.now()).slice(-6)}`,
        utilisateur_id: profil.id
      }));

    if (paiementPayload.length) await supabase.from("paiements").insert(paiementPayload);

    if (typeVente === "credit") {
      const resteTotal = ventesPayload.reduce((s, v) => s + Number(v.reste_a_payer || 0), 0);
      if (resteTotal > 0) {
        await supabase.from("creances").insert({
          entreprise_id: entreprise.id,
          client_id: venteForm.client_id,
          montant: resteTotal,
          statut: "impaye",
          date_echeance: venteForm.date_echeance || null
        });
      }
    }

    setVenteForm({ produit_id: produits[0]?.id || "", client_id: "", quantite: 1, type_vente: "comptant", mode_paiement: "Espèces", montant_paye: "", date_echeance: "" });
    setVenteLignes([{ produit_id: produits[0]?.id || "", quantite: 1 }]);
    setMessage("Vente professionnelle enregistrée avec succès.");
    chargerDonnees();
  }
  async function saveDevis(e) {
    e.preventDefault();
    if (!devisForm.client_id) return setMessage("Veuillez sélectionner un client pour créer le devis.");

    const lignesValides = devisLignes
      .map((l) => {
        const p = produits.find((x) => x.id === l.produit_id);
        const q = Number(l.quantite);
        return p && q > 0 ? { produit: p, quantite: q, prix_unitaire: Number(p.prix_vente) } : null;
      })
      .filter(Boolean);

    if (!lignesValides.length) return setMessage("Veuillez ajouter au moins un produit valide au devis.");

    const reference = `DEV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const montant = lignesValides.reduce((s, l) => s + l.quantite * l.prix_unitaire, 0);

    const { data: d, error } = await supabase.from("devis").insert({
      entreprise_id: entreprise.id,
      client_id: devisForm.client_id,
      reference,
      statut: "brouillon",
      montant_total: montant
    }).select("*").single();

    if (error) return showError(error, "Impossible de créer le devis.");

    const lignesPayload = lignesValides.map((l) => ({
      devis_id: d.id,
      produit_id: l.produit.id,
      quantite: l.quantite,
      prix_unitaire: l.prix_unitaire
    }));

    const { error: le } = await supabase.from("lignes_devis").insert(lignesPayload);
    if (le) return showError(le, "Le devis est créé mais les lignes produits n'ont pas été ajoutées.");

    setDevisForm({ client_id: "" });
    setDevisLignes([{ produit_id: produits[0]?.id || "", quantite: 1 }]);
    setMessage("Devis créé avec succès.");
    chargerDonnees();
  }

  async function convertirDevisEnFacture(d) {
    const { data: lignes, error: le } = await supabase.from("lignes_devis").select("*").eq("devis_id", d.id);
    if (le) return showError(le, "Impossible de lire les lignes du devis.");
    if (!lignes?.length) return setMessage("Ce devis ne contient aucune ligne.");

    const baseRef = `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const ventesPayload = lignes.map((l, index) => ({
      entreprise_id: entreprise.id,
      produit_id: l.produit_id,
      client_id: d.client_id,
      quantite: Number(l.quantite),
      prix_unitaire: Number(l.prix_unitaire),
      utilisateur_id: profil.id,
      reference: baseRef,
      statut: "validée",
      mode_paiement: "Espèces"
    }));

    const { error } = await supabase.from("ventes").insert(ventesPayload);
    if (error) return showError(error, "Impossible de convertir le devis en facture.");

    await supabase.from("devis").update({ statut: "converti" }).eq("id", d.id);
    setMessage("Devis converti en facture.");
    chargerDonnees();
  }

    async function modifierFacture(e) {
    e.preventDefault();
    if (!factureEditForm?.id) return;
    const p = produits.find((x) => x.id === factureEditForm.produit_id);
    const q = Number(factureEditForm.quantite);
    if (!p || q <= 0) return setMessage("Produit ou quantité invalide.");

    const { error } = await supabase.from("ventes").update({
      client_id: factureEditForm.client_id || null,
      produit_id: p.id,
      quantite: q,
      prix_unitaire: Number(factureEditForm.prix_unitaire || p.prix_vente),
      statut: factureEditForm.statut || "brouillon",
      mode_paiement: factureEditForm.mode_paiement || null
    }).eq("id", factureEditForm.id);

    if (error) return showError(error, "Impossible de modifier la facture.");
    setFactureEditForm(null);
    setMessage("Facture modifiée avec succès.");
    chargerDonnees();
  }

  async function changerStatutFacture(v, statut) {
    const ids = (v.lignes_facture || [v]).map((l) => l.id).filter(Boolean);
    const query = supabase.from("ventes").update({ statut });
    const { error } = ids.length > 1 ? await query.in("id", ids) : await query.eq("id", v.id);
    if (error) return showError(error, "Impossible de changer le statut de la facture.");
    setMessage(`Facture ${statut}.`);
    chargerDonnees();
  }

  async function dupliquerFacture(v) {
    const reference = `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const { error } = await supabase.from("ventes").insert({
      entreprise_id: entreprise.id,
      produit_id: v.produit_id,
      client_id: v.client_id || null,
      quantite: Number(v.quantite),
      prix_unitaire: Number(v.prix_unitaire),
      utilisateur_id: profil.id,
      reference,
      statut: "brouillon",
      mode_paiement: v.mode_paiement || null
    });
    if (error) return showError(error, "Impossible de dupliquer la facture.");
    setMessage("Facture dupliquée en brouillon.");
    chargerDonnees();
  }

  async function saveAchat(e) {
    e.preventDefault();

    if (!achatForm.fournisseur_id) return setMessage("Veuillez sélectionner un fournisseur.");

    const lignesValides = achatsLignes.map((l) => {
      const q = Number(l.quantite || 0);
      const prix = Number(l.prix_unitaire || 0);
      if (q <= 0 || prix < 0) return null;

      if ((l.mode || "existant") === "nouveau") {
        if (!String(l.nom || "").trim()) return null;
        return {
          mode: "nouveau",
          nom: String(l.nom).trim(),
          categorie_id: l.categorie_id || null,
          quantite: q,
          prix_unitaire: prix,
          prix_vente: Number(l.prix_vente || prix),
          seuil_alerte: Number(l.seuil_alerte || 5)
        };
      }

      const p = produits.find((x) => x.id === l.produit_id);
      const prixFinal = Number(l.prix_unitaire || p?.prix_achat || 0);
      return p && q > 0 ? { mode: "existant", produit: p, quantite: q, prix_unitaire: prixFinal } : null;
    }).filter(Boolean);

    if (!lignesValides.length) return setMessage("Ajoutez au moins un produit valide.");

    const achatsPayload = [];

    for (const l of lignesValides) {
      let produit = l.produit;

      if (l.mode === "nouveau") {
        const { data: newProduit, error: prodErr } = await supabase.from("produits").insert({
          entreprise_id: entreprise.id,
          nom: l.nom,
          categorie_id: l.categorie_id,
          code_produit: `PRD-${String(Date.now()).slice(-6)}`,
          quantite: 0,
          seuil_alerte: l.seuil_alerte,
          prix_achat: l.prix_unitaire,
          prix_vente: l.prix_vente
        }).select("*").single();

        if (prodErr) return showError(prodErr, `Impossible de créer le produit : ${l.nom}`);
        produit = newProduit;
      }

      achatsPayload.push({
        entreprise_id: entreprise.id,
        produit_id: produit.id,
        fournisseur_id: achatForm.fournisseur_id,
        quantite: l.quantite,
        prix_unitaire: l.prix_unitaire,
        utilisateur_id: profil.id
      });

      const stockAvant = Number(produit.quantite || 0);
      const stockApres = stockAvant + Number(l.quantite || 0);

      await supabase.from("produits").update({
        quantite: stockApres,
        prix_achat: l.prix_unitaire
      }).eq("id", produit.id);

      await supabase.from("mouvements_stock").insert({
        entreprise_id: entreprise.id,
        produit_id: produit.id,
        type_mouvement: "entree",
        quantite: l.quantite,
        stock_avant: stockAvant,
        stock_apres: stockApres,
        motif: l.mode === "nouveau" ? "Nouveau produit + achat" : "Achat fournisseur",
        utilisateur_id: profil.id
      });
    }

    const { error } = await supabase.from("achats").insert(achatsPayload);
    if (error) return showError(error, "Stock mis à jour mais achat non enregistré.");

    setAchatForm({ produit_id: produits[0]?.id || "", fournisseur_id: "", quantite: 1, prix_unitaire: "" });
    setAchatsLignes([{ mode: "existant", produit_id: produits[0]?.id || "", nom: "", categorie_id: "", quantite: 1, prix_unitaire: "", prix_vente: "", seuil_alerte: 5 }]);
    await addLog("Achats", "Création achat", `${achatsPayload.length} ligne(s) d\'achat enregistrée(s).`);
    setMessage("Achat enregistré avec succès.");
    chargerDonnees();
  }
  async function saveDepense(e) {
    e.preventDefault(); if (!depenseForm.montant || Number(depenseForm.montant) <= 0) return;
    const { error } = await supabase.from("depenses").insert({ entreprise_id: entreprise.id, categorie: depenseForm.categorie, montant: Number(depenseForm.montant), description: depenseForm.description || null, utilisateur_id: profil.id });
    if (error) showError(error, "Impossible d'enregistrer la dépense."); else { await addLog(table, "Suppression", `Suppression ID ${id}`); setDepenseForm({ categorie: CATEGORIES_DEPENSES[0], montant: "", description: "" }); chargerDonnees(); }
  }

  async function saveCaisse(e) {
    e.preventDefault();
    if (!entreprise?.id || !caisseForm.nom.trim()) return;
    const { error } = await supabase.from("caisses").insert({
      entreprise_id: entreprise.id,
      nom: caisseForm.nom.trim(),
      solde: Number(caisseForm.solde || 0)
    });
    if (error) showError(error, "Impossible de créer la caisse.");
    else { setCaisseForm({ nom: "Caisse principale", solde: 0 }); chargerDonnees(); }
  }

  async function saveMouvementCaisse(e) {
    e.preventDefault();
    const montant = Number(mouvementCaisseForm.montant);
    const caisse = caisses.find(c => c.id === mouvementCaisseForm.caisse_id);
    if (!caisse || montant <= 0) return;
    const payloadMouvement = {
      entreprise_id: entreprise.id,
      caisse_id: caisse.id,
      type: mouvementCaisseForm.type,
      montant,
      description: mouvementCaisseForm.description || null,
      mode_paiement: mouvementCaisseForm.mode_paiement || "Espèces",
      reference_operation: mouvementCaisseForm.reference || null,
      utilisateur_id: profil?.id || null
    };
    let { error } = await supabase.from("mouvements_caisses").insert(payloadMouvement);
    if (error && /column|schema cache|mode_paiement|reference_operation|utilisateur_id/i.test(error.message || "")) {
      const fallback = await supabase.from("mouvements_caisses").insert({
        entreprise_id: entreprise.id,
        caisse_id: caisse.id,
        type: mouvementCaisseForm.type,
        montant,
        description: `${mouvementCaisseForm.description || ""} — Mode : ${mouvementCaisseForm.mode_paiement || "Espèces"}${mouvementCaisseForm.reference ? ` — Réf : ${mouvementCaisseForm.reference}` : ""}`
      });
      error = fallback.error;
    }
    if (error) return showError(error, "Impossible d'enregistrer le mouvement de caisse.");
    const nouveauSolde = Number(caisse.solde || 0) + (mouvementCaisseForm.type === "entree" ? montant : -montant);
    const { error: upErr } = await supabase.from("caisses").update({ solde: nouveauSolde }).eq("id", caisse.id);
    if (upErr) return showError(upErr, "Mouvement créé mais solde non mis à jour.");
    setMouvementCaisseForm({ caisse_id: caisse.id, type: "entree", montant: "", description: "", mode_paiement: "Espèces", reference: "" });
    chargerDonnees();
  }

  async function saveBanque(e) {
    e.preventDefault();
    if (!entreprise?.id || !banqueForm.nom.trim()) return;
    const { error } = await supabase.from("banques").insert({
      entreprise_id: entreprise.id,
      nom: banqueForm.nom.trim(),
      numero_compte: banqueForm.numero_compte || null,
      solde: Number(banqueForm.solde || 0)
    });
    if (error) showError(error, "Impossible de créer le compte bancaire.");
    else { setBanqueForm({ nom: "", numero_compte: "", solde: 0 }); chargerDonnees(); }
  }

  async function saveMouvementBanque(e) {
    e.preventDefault();
    const montant = Number(mouvementBanqueForm.montant);
    const banque = banques.find(b => b.id === mouvementBanqueForm.banque_id);
    if (!banque || montant <= 0) return;
    const { error } = await supabase.from("mouvements_banques").insert({
      entreprise_id: entreprise.id,
      banque_id: banque.id,
      type: mouvementBanqueForm.type,
      montant,
      description: mouvementBanqueForm.description || null
    });
    if (error) return showError(error, "Impossible d'enregistrer le mouvement bancaire.");
    const nouveauSolde = Number(banque.solde || 0) + (mouvementBanqueForm.type === "depot" ? montant : -montant);
    const { error: upErr } = await supabase.from("banques").update({ solde: nouveauSolde }).eq("id", banque.id);
    if (upErr) return showError(upErr, "Mouvement créé mais solde non mis à jour.");
    setMouvementBanqueForm({ banque_id: banque.id, type: "depot", montant: "", description: "" });
    chargerDonnees();
  }

  async function saveCreance(e) {
    e.preventDefault();
    if (!creanceForm.client_id || Number(creanceForm.montant) <= 0) return;
    const { error } = await supabase.from("creances").insert({
      entreprise_id: entreprise.id,
      client_id: creanceForm.client_id,
      montant: Number(creanceForm.montant),
      statut: "impaye",
      date_echeance: creanceForm.date_echeance || null
    });
    if (error) showError(error, "Impossible d'enregistrer la créance.");
    else { setCreanceForm({ client_id: "", montant: "", date_echeance: "" }); chargerDonnees(); }
  }

  async function saveDette(e) {
    e.preventDefault();
    if (!detteForm.fournisseur_id || Number(detteForm.montant) <= 0) return;
    const { error } = await supabase.from("dettes").insert({
      entreprise_id: entreprise.id,
      fournisseur_id: detteForm.fournisseur_id,
      montant: Number(detteForm.montant),
      statut: "impaye",
      date_echeance: detteForm.date_echeance || null
    });
    if (error) showError(error, "Impossible d'enregistrer la dette.");
    else { setDetteForm({ fournisseur_id: "", montant: "", date_echeance: "" }); chargerDonnees(); }
  }

  async function marquerPaye(table, id) {
    const { error } = await supabase.from(table).update({ statut: "paye" }).eq("id", id);
    if (error) showError(error, "Impossible de marquer comme payé.");
    else chargerDonnees();
  }

  async function enregistrerPaiementFacture(e) {
    e.preventDefault();
    const vente = ventes.find(v => v.id === paiementForm.vente_id);
    const montant = Number(paiementForm.montant || 0);
    if (!vente || montant <= 0) return setMessage("Veuillez choisir une facture et saisir un montant valide.");

    const resteActuel = Number(vente.reste_a_payer || 0);
    if (montant > resteActuel) return setMessage("Le paiement dépasse le reste à payer.");

    const nouveauPaye = Number(vente.montant_paye || 0) + montant;
    const nouveauReste = Math.max(resteActuel - montant, 0);

    const { error: payErr } = await supabase.from("paiements").insert({
      entreprise_id: entreprise.id,
      vente_id: vente.id,
      montant,
      mode_paiement: paiementForm.mode_paiement,
      reference: paiementForm.reference || `PAY-${String(Date.now()).slice(-6)}`,
      utilisateur_id: profil.id
    });

    if (payErr) return showError(payErr, "Impossible d'enregistrer le paiement.");

    const { error: upErr } = await supabase.from("ventes").update({
      montant_paye: nouveauPaye,
      reste_a_payer: nouveauReste,
      statut: nouveauReste <= 0 ? "payée" : "validée",
      mode_paiement: paiementForm.mode_paiement
    }).eq("id", vente.id);

    if (upErr) return showError(upErr, "Paiement créé mais facture non mise à jour.");

    setPaiementForm({ vente_id: "", montant: "", mode_paiement: "Espèces", reference: "" });
    setMessage("Paiement enregistré.");
    chargerDonnees();
  }

  async function saveEntreprise(e) {
    e.preventDefault();
    const payloadEntreprise = { ...entrepriseForm, telephone: entrepriseForm.telephone ? `+221 ${String(entrepriseForm.telephone).replace(/^\+221\s?/, "")}` : null };
    const { error } = await supabase.from("entreprises").update(payloadEntreprise).eq("id", entreprise.id);
    if (error) showError(error, "Impossible de modifier les paramètres."); else { setMessage("Paramètres enregistrés."); chargerProfilEtEntreprise(); }
  }
  function imprimerFacture(v) {
    const ref = factureReferenceGroupe(v);
    const lignesSource = (v.lignes_facture && v.lignes_facture.length)
      ? v.lignes_facture
      : ventes.filter((x) => factureReferenceGroupe(x) === ref && x.client_id === v.client_id);
    const lignes = lignesSource.length ? lignesSource : [v];
    const c = clients.find((x) => x.id === v.client_id);
    const total = lignes.reduce((s, ligne) => s + Number(ligne.quantite || 0) * Number(ligne.prix_unitaire || 0), 0);
    const totalPaye = lignes.reduce((s, ligne) => s + Number(ligne.montant_paye || 0), 0);
    const reste = lignes.reduce((s, ligne) => s + Number(ligne.reste_a_payer || 0), 0);
    const statutFacture = reste <= 0 ? "payée" : (v.statut || "validée");
    const modePaiement = v.mode_paiement || lignes[0]?.mode_paiement || "Espèces";

    if (reste > 0) {
      const continuer = window.confirm(`Cette facture n'est pas totalement payée.\nReste à payer : ${fmt(reste)}.\n\nVoulez-vous quand même l'imprimer ?`);
      if (!continuer) return;
    }

    const lignesHtml = lignes.map((ligne) => {
      const p = produits.find((x) => x.id === ligne.produit_id);
      const ligneTotal = Number(ligne.quantite || 0) * Number(ligne.prix_unitaire || 0);
      return `<tr>
        <td>${safeText(p?.nom || "Produit")}</td>
        <td class="right">${safeText(ligne.quantite)}</td>
        <td class="right">${safeText(fmt(ligne.prix_unitaire))}</td>
        <td class="right"><strong>${safeText(fmt(ligneTotal))}</strong></td>
      </tr>`;
    }).join("");

    const html = `
      <html>
        <head>
          <title>${safeText(ref)}</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: Arial, sans-serif; margin: 0; background: #f4f4f4; color: #152238; }
            .page { width: 850px; margin: 24px auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 20px 60px rgba(21,34,56,.16); }
            .header { display: flex; justify-content: space-between; gap: 20px; border-bottom: 5px solid #1E7F6E; padding-bottom: 18px; }
            .brand h1 { margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: .5px; }
            .brand div { margin-top: 6px; font-size: 13px; color: #5b6472; line-height: 1.45; }
            .badge { text-align: right; }
            .badge h2 { margin: 0; color: #1E7F6E; font-size: 28px; }
            .badge div { margin-top: 8px; font-size: 14px; font-weight: bold; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin: 24px 0; }
            .box { border: 1px solid #e6e9ef; border-radius: 14px; padding: 16px; background: #fbfcfd; }
            .box-title { text-transform: uppercase; font-size: 11px; font-weight: 900; color: #1E7F6E; letter-spacing: .8px; margin-bottom: 8px; }
            .line { font-size: 13px; margin: 5px 0; color: #344054; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; overflow: hidden; border-radius: 12px; }
            th { background: #152238; color: white; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: .5px; }
            td { padding: 12px; border-bottom: 1px solid #edf0f4; font-size: 13px; }
            tr:nth-child(even) td { background: #F8FAFC; }
            .right { text-align: right; }
            .total-box { margin-top: 18px; margin-left: auto; width: 330px; border: 1px solid #e6e9ef; border-radius: 14px; overflow: hidden; }
            .total-row { display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #edf0f4; font-size: 14px; }
            .total-row:last-child { border-bottom: none; background: #1E7F6E; color: white; font-size: 18px; font-weight: 900; }
            .signature { margin-top: 36px; display: flex; justify-content: flex-end; }
            .signature div { width: 220px; border-top: 1px solid #152238; padding-top: 8px; text-align: center; font-size: 13px; }
            .footer { margin-top: 28px; text-align: center; color: #5b6472; font-size: 13px; }
            @media print { body { background: white; } .page { width: auto; margin: 0; border-radius: 0; box-shadow: none; } }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              <div class="brand">
                <h1>${safeText(entreprise?.nom || "Suivi PME")}</h1>
                <div>
                  ${safeText(entreprise?.adresse || "")}<br/>
                  ${entreprise?.telephone ? "Tél : " + safeText(entreprise.telephone) + "<br/>" : ""}
                  ${entreprise?.email ? "Email : " + safeText(entreprise.email) + "<br/>" : ""}
                  ${entreprise?.ninea ? "NINEA : " + safeText(entreprise.ninea) + "<br/>" : ""}
                  ${entreprise?.rccm ? "RCCM : " + safeText(entreprise.rccm) : ""}
                </div>
              </div>
              <div class="badge">
                <h2>FACTURE</h2>
                <div>N° ${safeText(ref)}</div>
                <div>Date : ${safeText(formatDateFr(v.date_vente || lignes[0]?.date_vente))}</div>
                <div>Heure : ${safeText(new Date(v.created_at || lignes[0]?.created_at || Date.now()).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }))}</div>
              </div>
            </div>

            <div class="grid">
              <div class="box">
                <div class="box-title">Facturé à</div>
                <div class="line"><strong>${safeText(c?.nom || "Client non renseigné")}</strong></div>
                ${c?.telephone ? `<div class="line">Tél : ${safeText(c.telephone)}</div>` : ""}
                ${c?.email ? `<div class="line">Email : ${safeText(c.email)}</div>` : ""}
                ${c?.adresse ? `<div class="line">Adresse : ${safeText(c.adresse)}</div>` : ""}
              </div>
              <div class="box">
                <div class="box-title">Détails</div>
                <div class="line"><strong>Référence :</strong> ${safeText(ref)}</div>
                <div class="line"><strong>Produits :</strong> ${safeText(lignes.length)} ligne(s)</div>
                <div class="line"><strong>Mode :</strong> ${safeText(modePaiement)}</div>
                <div class="line"><strong>Statut :</strong> ${safeText(statutFacture)}</div>
                <div class="line"><strong>Devise :</strong> FCFA</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th class="right">Qté</th>
                  <th class="right">Prix unitaire</th>
                  <th class="right">Total</th>
                </tr>
              </thead>
              <tbody>${lignesHtml}</tbody>
            </table>

            <div class="total-box">
              <div class="total-row"><span>Montant payé</span><span>${safeText(fmt(totalPaye))}</span></div>
              <div class="total-row"><span>Reste à payer</span><span>${safeText(fmt(reste))}</span></div>
              <div class="total-row"><span>Total facture</span><span>${safeText(fmt(total))}</span></div>
            </div>

            <div class="signature"><div>Signature / Cachet</div></div>
            <div class="footer">Merci pour votre confiance.<br/>Facture générée par Suivi PME.</div>
          </div>
          <script>window.print()</script>
        </body>
      </html>
    `;

    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
  }

  function imprimerDocumentSimple(type, ref, tiers, montant, date) {
    const html = `<html><head><title>${safeText(ref)}</title><style>body{font-family:Arial;background:#f4f4f4;margin:0;color:#152238}.page{width:800px;margin:24px auto;background:#fff;padding:38px;border-radius:12px}.head{display:flex;justify-content:space-between;border-bottom:4px solid #1E7F6E;padding-bottom:18px}h1{margin:0;text-transform:uppercase}.ref{text-align:right;color:#1E7F6E;font-size:22px;font-weight:bold}.box{border:1px solid #ddd;border-radius:10px;padding:14px;margin:22px 0}.total{font-size:24px;color:#1E7F6E;font-weight:bold;text-align:right;margin-top:30px}@media print{body{background:#fff}.page{margin:0;width:auto}}</style></head><body><div class="page"><div class="head"><div><h1>${safeText(entreprise?.nom || "Suivi PME")}</h1><div>${safeText(entreprise?.adresse || "")}<br/>${safeText(entreprise?.telephone || "")}</div></div><div class="ref">${safeText(type)}<br/>${safeText(ref)}</div></div><div class="box"><b>Date :</b> ${safeText(formatDateFr(date))}<br/><b>Client :</b> ${safeText(tiers || "Non renseigné")}</div><div class="total">Total : ${safeText(fmt(montant))}</div><br/><br/><div style="text-align:right">Signature / Cachet</div></div><script>window.print()</script></body></html>`;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
  }


  const revenusSaasMois = useMemo(() => paiementsSaas
    .filter(p => String(p.date_paiement || "").slice(0,7) === new Date().toISOString().slice(0,7))
    .reduce((s,p) => s + Number(p.montant || 0), 0), [paiementsSaas]);

  const revenusSaasAnnee = useMemo(() => paiementsSaas
    .filter(p => String(p.date_paiement || "").slice(0,4) === String(new Date().getFullYear()))
    .reduce((s,p) => s + Number(p.montant || 0), 0), [paiementsSaas]);

  const abonnementsActifs = useMemo(() => abonnements.filter(a => a.statut === "actif").length, [abonnements]);

  const getPlanEssai = useCallback(() => plans.find(p => String(p.nom || "").trim().toLowerCase() === "essai gratuit"), [plans]);
  const getPlanMensuel = useCallback(() => plans.find(p => String(p.nom || "").trim().toLowerCase() === "abonnement mensuel"), [plans]);
  const plansAbonnementVisibles = useMemo(() => {
    const allowed = ["essai gratuit", "abonnement mensuel"];
    const filtered = plans.filter(p => allowed.includes(String(p.nom || "").trim().toLowerCase()));
    return filtered.length ? filtered : [
      { id: "local-essai", nom: "Essai Gratuit", prix_mensuel: 0, limite_utilisateurs: 2, limite_produits: 100, modules: MODULES_ESSAI, actif: true },
      { id: "local-mensuel", nom: "Abonnement Mensuel", prix_mensuel: ABONNEMENT_MENSUEL, limite_utilisateurs: 999, limite_produits: 999999, modules: MODULES_MENSUEL, actif: true }
    ];
  }, [plans]);
  const entreprisesAbonnables = useMemo(() => allEntreprises.filter(e => !isEntrepriseSysteme(e)), [allEntreprises]);
  const pmeClientesSaas = useMemo(() => allEntreprises.filter(e => !isEntrepriseSysteme(e)), [allEntreprises]);
  const abonnementCourantEntreprise = useMemo(() => {
    if (!entreprise?.id) return null;
    return abonnements.find(a => a.entreprise_id === entreprise.id) || null;
  }, [abonnements, entreprise?.id]);
  const dateFinAbonnementCourante = entreprise?.date_fin_abonnement || abonnementCourantEntreprise?.date_fin || null;
  const joursRestantsAbonnement = useMemo(() => {
    if (!dateFinAbonnementCourante) return null;
    const fin = new Date(`${dateFinAbonnementCourante}T23:59:59`);
    if (Number.isNaN(fin.getTime())) return null;
    return Math.ceil((fin.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  }, [dateFinAbonnementCourante]);
  const abonnementPMEExpire = !entreprise?.est_systeme && (entreprise?.abonnement_actif === false || joursRestantsAbonnement < 0 || ["expire", "suspendu"].includes(entreprise?.statut_saas));
  const abonnementPMEAlerte = !abonnementPMEExpire && joursRestantsAbonnement !== null && joursRestantsAbonnement <= JOURS_ALERTE_ABONNEMENT;
  const statutAbonnementPME = abonnementPMEExpire ? "Expiré / suspendu" : abonnementPMEAlerte ? `Expire dans ${joursRestantsAbonnement} jour(s)` : joursRestantsAbonnement !== null ? `Actif — ${joursRestantsAbonnement} jour(s) restant(s)` : "Actif";
  const abonnementsAffiches = useMemo(() => abonnements.filter(a => entreprisesAbonnables.some(e => e.id === a.entreprise_id)), [abonnements, entreprisesAbonnables]);
  const abonnementsExpireBientot = useMemo(() => entreprisesAbonnables.filter(e => {
    if (!e.date_fin_abonnement) return false;
    const fin = new Date(`${e.date_fin_abonnement}T23:59:59`);
    if (Number.isNaN(fin.getTime())) return false;
    const jours = Math.ceil((fin.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return jours >= 0 && jours <= JOURS_ALERTE_ABONNEMENT;
  }).length, [entreprisesAbonnables]);
  const ticketsOuverts = useMemo(() => ticketsSupport.filter(t => t.statut !== "ferme").length, [ticketsSupport]);



  async function initialiserNouvellePME(entrepriseId, nomEntreprise = "Nouvelle PME") {
    if (!entrepriseId) return;

    await supabase.from("caisses").insert({
      entreprise_id: entrepriseId,
      nom: "Caisse principale",
      solde: 0
    });

    const categoriesBase = ["Général", "Boissons", "Alimentation", "Accessoires", "Services"];
    for (const nom of categoriesBase) {
      await supabase.from("categories").insert({
        entreprise_id: entrepriseId,
        nom
      });
    }

    await supabase.from("notifications").insert({
      entreprise_id: entrepriseId,
      titre: "Bienvenue sur Suivi PME",
      message: `L'espace de ${nomEntreprise} est prêt. Toutes les fonctionnalités démarrent à zéro.`,
      type_notification: "info",
      canal: "application",
      statut: "non_lue"
    });

    await supabase.from("logs").insert({
      entreprise_id: entrepriseId,
      utilisateur_id: profil?.id || null,
      module: "Super Admin",
      action: "Initialisation PME",
      details: `Espace initialisé pour ${nomEntreprise}`
    });
  }



  function ouvrirAdministrationPME(pme) {
    setSelectedPmeAdmin(pme);
    setEditPmeForm({
      nom: pme.nom || "",
      telephone: pme.telephone || "",
      email: pme.email || "",
      adresse: pme.adresse || "",
      ninea: pme.ninea || "",
      rccm: pme.rccm || "",
      statut_saas: pme.statut_saas || "actif"
    });
  }

  async function sauvegarderPMEAdmin(e) {
    e.preventDefault();
    if (!selectedPmeAdmin?.id) return setMessage("Aucune PME sélectionnée.");

    const { error } = await supabase.from("entreprises").update({
      nom: editPmeForm.nom,
      telephone: editPmeForm.telephone || null,
      email: editPmeForm.email || null,
      adresse: editPmeForm.adresse || null,
      ninea: editPmeForm.ninea || null,
      rccm: editPmeForm.rccm || null,
      statut_saas: editPmeForm.statut_saas || "actif"
    }).eq("id", selectedPmeAdmin.id);

    if (error) return showError(error, "Impossible de modifier la PME.");

    await addLog("Super Admin", "Modification PME", `PME modifiée : ${editPmeForm.nom}`);
    setMessage("PME modifiée avec succès.");
    chargerSuperAdminData();
  }

  async function changerRoleUserPME(userId, poste) {
    const cible = allProfils.find(u => u.id === userId);
    if (!cible) return setMessage("Utilisateur introuvable.");
    const { error } = await supabase.from("profils").update({ poste }).eq("id", userId);
    if (error) return showError(error, "Impossible de changer le rôle.");
    await addLog("Super Admin", "Changement rôle utilisateur", `${cible.nom_complet} -> ${poste}`);
    setMessage("Rôle utilisateur modifié.");
    chargerSuperAdminData();
  }

  async function changerStatutUserPME(userId, actif) {
    const cible = allProfils.find(u => u.id === userId);
    if (!cible) return setMessage("Utilisateur introuvable.");
    const { error } = await supabase.from("profils").update({ actif }).eq("id", userId);
    if (error) return showError(error, "Impossible de modifier le statut utilisateur.");
    await addLog("Super Admin", actif ? "Activation utilisateur" : "Désactivation utilisateur", cible.nom_complet || userId);
    setMessage(actif ? "Utilisateur activé." : "Utilisateur désactivé.");
    chargerSuperAdminData();
  }

  async function changerStatutPME(pmeId, statut) {
    const { error } = await supabase.from("entreprises").update({ statut_saas: statut }).eq("id", pmeId);
    if (error) return showError(error, "Impossible de changer le statut de la PME.");
    await addLog("Super Admin", "Changement statut PME", `${pmeId} -> ${statut}`);
    setMessage("Statut PME modifié.");
    chargerSuperAdminData();
  }



  function appliquerAttenteRattachementV696(payload) {
    if (!isSuperAdmin) return payload;
    const info = getEntrepriseCreationUser();
    if (!info.en_attente) return payload;

    return {
      ...payload,
      entreprise_id: info.entreprise_id,
      poste: "a_rattacher",
      role: "employe",
      actif: false,
      created_by: null
    };
  }


  function appliquerAttenteRattachementV701(payload) {
    if (!isSuperAdmin) return payload;
    const info = getEntrepriseCreationUser();
    if (!info.en_attente) return payload;
    return {
      ...payload,
      entreprise_id: info.entreprise_id,
      poste: "a_rattacher",
      role: "employe",
      actif: false,
      created_by: null
    };
  }

  async function chargerUsersNonRattaches() {
    const { data, error } = await supabase
      .from("profils")
      .select("*")
      .or("entreprise_id.is.null,poste.eq.a_rattacher,statut_rattachement.eq.en_attente")
      .order("created_at", { ascending: false });

    if (!error) {
      setUsersNonRattaches((data || []).filter(u => u.poste !== "super_admin"));
    } else {
      showError(error, "Impossible de charger les utilisateurs en attente.");
    }
  }

  async function alerterNouveauUserARattacher(user) {
    await supabase.from("notifications").insert({
      entreprise_id: user.entreprise_id || null,
      utilisateur_id: null,
      titre: "Nouvel utilisateur à rattacher",
      message: `${user.nom_complet || user.email || "Nouvel utilisateur"} doit être rattaché à une PME.`,
      type_notification: "alerte",
      canal: "application",
      statut: "non_lue"
    });

    await supabase.from("messagerie_saas").insert({
      entreprise_id: user.entreprise_id || null,
      expediteur_id: user.id || null,
      destinataire_id: null,
      sujet: "Nouvel utilisateur à rattacher",
      message: `Un nouvel utilisateur a été créé et attend son rattachement.\\n\\nNom : ${user.nom_complet || "—"}\\nEmail : ${user.email || "—"}\\nPoste demandé : ${user.poste || "—"}`,
      statut: "non_lu"
    });

    await addLog("Utilisateurs", "Alerte rattachement", `${user.nom_complet || user.email || user.id}`);
  }

  async function rattacherUserAPME(e) {
    e?.preventDefault?.();
    if (!rattachementForm.user_id || !rattachementForm.entreprise_id) {
      return setMessage("Veuillez sélectionner un utilisateur et une PME.");
    }

    const { error } = await supabase.from("profils").update({
      entreprise_id: rattachementForm.entreprise_id,
      poste: rattachementForm.poste || "employe",
      poste_souhaite: rattachementForm.poste || "employe",
      role: rattachementForm.poste === "gerant" ? "gerant" : "employe",
      statut_rattachement: "rattache",
      date_rattachement: new Date().toISOString(),
      actif: true,
      created_by: null
    }).eq("id", rattachementForm.user_id);

    if (error) return showError(error, "Impossible de rattacher l'utilisateur.");

    const user = usersNonRattaches.find(u => u.id === rattachementForm.user_id);
    const pme = allEntreprises.find(e => e.id === rattachementForm.entreprise_id);

    await supabase.from("notifications").insert({
      entreprise_id: rattachementForm.entreprise_id,
      utilisateur_id: rattachementForm.user_id,
      titre: "Compte rattaché",
      message: `Votre compte est maintenant rattaché à ${pme?.nom || "votre PME"}.`,
      type_notification: "success",
      canal: "application",
      statut: "non_lue"
    });

    await addLog("Utilisateurs", "Rattachement PME", `${user?.nom_complet || rattachementForm.user_id} -> ${pme?.nom || rattachementForm.entreprise_id}`);

    setRattachementForm({ user_id: "", entreprise_id: "", poste: "employe" });
    setMessage("Utilisateur rattaché à la PME avec succès.");
    chargerSuperAdminData();
    chargerUsersNonRattaches();
  }


  async function creerPremierGerantPME(entrepriseId, nomEntreprise) {
    if (!premierGerantForm.creer) return null;
    if (!premierGerantForm.nom_complet.trim() || !premierGerantForm.email.trim()) {
      setMessage("PME créée, mais le premier gérant n’a pas été créé : nom et email requis.");
      return null;
    }

    const tempPassword = premierGerantForm.mot_de_passe || `SuiviPME@${String(Date.now()).slice(-6)}`;
const { data: existing } = await supabase
      .from("profils")
      .select("id")
      .eq("email", premierGerantForm.email.trim())
      .maybeSingle();

    if (!existing) {
      const { error: profilError } = await supabase.from("profils").insert({
        id: crypto.randomUUID(),
        entreprise_id: entrepriseId,
        created_by: null,
        nom_complet: premierGerantForm.nom_complet.trim(),
        email: premierGerantForm.email.trim(),
        telephone: premierGerantForm.telephone || null,
        role: "gerant",
        poste: "gerant",
        actif: true
      });
      if (profilError) {
        showError(profilError, "PME créée, mais impossible de créer le profil gérant.");
        return null;
      }
    } else {
      await supabase.from("profils").update({
        entreprise_id: entrepriseId,
        created_by: null,
        poste: "gerant",
        role: "gerant",
        actif: true
      }).eq("id", existing.id);
    }

    await addLog("Super Admin", "Création premier gérant", `${premierGerantForm.nom_complet} pour ${nomEntreprise}`);
    return { email: premierGerantForm.email.trim(), tempPassword };
  }



  async function supprimerUtilisateurAdmin(userId) {
    const cible = allProfils.find(u => u.id === userId) || usersNonRattaches.find(u => u.id === userId);
    if (!cible) return setMessage("Utilisateur introuvable.");
    if (cible.poste === "super_admin") return setMessage("Impossible de supprimer le Super Admin.");
    if (!window.confirm(`Supprimer définitivement l'utilisateur ${cible.nom_complet || cible.email || userId} ?`)) return;

    const { error } = await supabase.from("profils").delete().eq("id", userId);
    if (error) return showError(error, "Impossible de supprimer l'utilisateur.");

    await addLog("Super Admin", "Suppression utilisateur", cible.nom_complet || cible.email || userId);
    setMessage("Utilisateur supprimé.");
    chargerSuperAdminData();
    chargerUsersNonRattaches?.();
  }

  async function creerProfilEnAttente(e) {
    e?.preventDefault?.();

    if (!newUserForm.nom_complet?.trim()) return setMessage("Veuillez renseigner le nom complet.");
    if (!newUserForm.email?.trim()) return setMessage("Veuillez renseigner l'email.");

    const pmeChoisie = newUserForm.entreprise_id || "";
    const enAttente = !pmeChoisie;

    const payload = {
      id: crypto.randomUUID(),
      entreprise_id: enAttente ? null : pmeChoisie,
      created_by: null,
      nom_complet: newUserForm.nom_complet.trim(),
      email: newUserForm.email.trim(),
      telephone: newUserForm.telephone || null,
      role: newUserForm.poste === "gerant" ? "gerant" : "employe",
      poste: enAttente ? "a_rattacher" : (newUserForm.poste || "employe"),
      poste_souhaite: newUserForm.poste || "employe",
      statut_rattachement: enAttente ? "en_attente" : "rattache",
      date_rattachement: enAttente ? null : new Date().toISOString(),
      actif: !enAttente
    };

    const { error } = await supabase.from("profils").insert(payload);
    if (error) return showError(error, "Impossible de créer l'utilisateur.");

    await addLog("Super Admin", enAttente ? "Création utilisateur en attente" : "Création utilisateur rattaché", `${payload.nom_complet} - ${payload.email}`);
    setNewUserForm({ entreprise_id: "", nom_complet: "", email: "", telephone: "", poste: "employe" });
    setMessage(enAttente ? "Utilisateur créé en attente de rattachement." : "Utilisateur créé et rattaché à la PME.");
    chargerSuperAdminData();
    chargerUsersNonRattaches?.();
  }

  async function superCreerPME(e) {
    e.preventDefault();
    if (!superPmeForm.nom.trim()) return setMessage("Veuillez renseigner le nom de la PME.");

    const { data: ent, error } = await supabase.from("entreprises").insert({
      nom: superPmeForm.nom.trim(),
      telephone: superPmeForm.telephone ? `+221 ${String(superPmeForm.telephone).replace(/^\\+221\\s?/, "")}` : null,
      email: superPmeForm.email || null,
      adresse: superPmeForm.adresse || null,
      ninea: superPmeForm.ninea || null,
      rccm: superPmeForm.rccm || null,
      code_entreprise: `ENT-${String(Date.now()).slice(-6)}`
    }).select("*").single();

    if (error) return showError(error, "Impossible de créer la PME.");

    await initialiserNouvellePME(ent.id, ent.nom);

    const gerantCree = await creerPremierGerantPME(ent.id, ent.nom);

    if (superPmeForm.plan_id) {
      await supabase.from("abonnements").insert({
        entreprise_id: ent.id,
        plan_id: superPmeForm.plan_id,
        statut: "actif",
        date_fin: superPmeForm.date_fin || null
      });
    }

    setSuperPmeForm({ nom: "", telephone: "", email: "", adresse: "", ninea: "", rccm: "", plan_id: "", date_fin: "" });
    setPremierGerantForm({ creer: true, nom_complet: "", email: "", telephone: "", mot_de_passe: "" });
    await addLog("Super Admin", "Création PME", `PME créée : ${ent.nom}`);
    setMessage(`PME créée et initialisée à zéro${gerantCree ? " avec son premier gérant" : ""}. Code invitation : ${ent.code_invitation}`);
    chargerSuperAdminData();
  }

  async function savePlan(e) {
    e.preventDefault();
    if (!planForm.nom.trim()) return setMessage("Nom du plan obligatoire.");
    const { error } = await supabase.from("plans").insert({
      nom: planForm.nom.trim(),
      prix_mensuel: Number(planForm.prix_mensuel || 0),
      limite_utilisateurs: Number(planForm.limite_utilisateurs || 1),
      limite_produits: Number(planForm.limite_produits || 100),
      modules: String(planForm.modules || "").split(",").map(x=>x.trim()).filter(Boolean),
      actif: planForm.actif
    });
    if (error) return showError(error, "Impossible de créer le plan.");
    setPlanForm({ nom: "", prix_mensuel: "", limite_utilisateurs: 1, limite_produits: 100, modules: "", actif: true });
    await addLog("Abonnements", "Création plan", `Plan créé : ${planForm.nom}`);
    setMessage("Plan créé.");
    chargerSuperAdminData();
  }

  async function saveAbonnement(e) {
    e.preventDefault();
    if (!abonnementForm.entreprise_id || !abonnementForm.plan_id) return setMessage("Entreprise et plan obligatoires.");
    const { error } = await supabase.from("abonnements").insert({
      entreprise_id: abonnementForm.entreprise_id,
      plan_id: abonnementForm.plan_id,
      statut: abonnementForm.statut,
      date_fin: abonnementForm.date_fin || null
    });
    if (error) return showError(error, "Impossible de créer l'abonnement.");
    setAbonnementForm({ entreprise_id: "", plan_id: "", statut: "actif", date_fin: "" });
    await addLog("Abonnements", "Création abonnement", "Nouvel abonnement créé.");
    setMessage("Abonnement créé.");
    chargerSuperAdminData();
  }

  async function saveTicketSupport(e) {
    e.preventDefault();
    if (!ticketForm.sujet.trim()) return setMessage("Sujet obligatoire.");
    const { error } = await supabase.from("tickets_support").insert({
      entreprise_id: entreprise?.id || null,
      sujet: ticketForm.sujet.trim(),
      message: ticketForm.message || null,
      priorite: ticketForm.priorite,
      statut: "ouvert"
    });
    if (error) return showError(error, "Impossible de créer le ticket.");
    setTicketForm({ sujet: "", message: "", priorite: "normale" });
    await addLog("Support", "Création ticket", ticketForm.sujet);
    setMessage("Ticket support créé.");
    chargerSuperAdminData();
  }

  async function changerStatutTicket(id, statut) {
    const { error } = await supabase.from("tickets_support").update({ statut }).eq("id", id);
    if (error) return showError(error, "Impossible de modifier le ticket.");
    chargerSuperAdminData();
  }

  async function changerStatutAbonnement(id, statut) {
    const { error } = await supabase.from("abonnements").update({ statut }).eq("id", id);
    if (error) return showError(error, "Impossible de modifier l'abonnement.");
    chargerSuperAdminData();
  }

  if (session === undefined || profilLoading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: themeBg, fontFamily: "Inter, sans-serif", color: themeText }}>Chargement de votre espace…</div>;
  if (!session) return <AuthScreen onAuthenticated={chargerProfilEtEntreprise} />;

  if (session && !profil) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: themeBg, fontFamily: "Inter, sans-serif", color: themeText, padding: 24 }}>
        <div style={{ background: CARD, borderRadius: 16, padding: 28, maxWidth: 620, width: "100%", border: `1px solid ${INK}14`, boxShadow: "0 20px 70px rgba(21,34,56,0.12)" }}>
          <h2 style={{ marginTop: 0, fontFamily: "Sora, sans-serif" }}>Session connectée, mais profil introuvable</h2>
          <p>Votre authentification Supabase est correcte, mais aucune ligne correspondante n'est lisible dans la table <b>profils</b>.</p>
          <p><b>Email connecté :</b> {session.user.email}</p>
          <p><b>ID connecté :</b> {session.user.id}</p>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <Button onClick={chargerProfilEtEntreprise}>Réessayer</Button>
            <Button secondary onClick={() => supabase.auth.signOut()}>Déconnexion</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin && !profil?.entreprise_id) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: themeBg, fontFamily: "Inter, sans-serif", color: themeText, padding: 24 }}>
        <div style={{ background: CARD, borderRadius: 16, padding: 28, maxWidth: 620, width: "100%", border: `1px solid ${INK}14`, boxShadow: "0 20px 70px rgba(21,34,56,0.12)" }}>
          <h2 style={{ marginTop: 0, fontFamily: "Sora, sans-serif" }}>Compte en attente de rattachement</h2>
          <p>Votre compte est créé, mais il n'est pas encore rattaché à une PME. Le SuperAdmin doit choisir votre PME et votre rôle.</p>
          <p><b>Email :</b> {profil.email || session.user.email}</p>
          <p><b>Statut :</b> {profil.statut_rattachement || "en_attente"}</p>
          <Button secondary onClick={() => supabase.auth.signOut()}>Déconnexion</Button>
        </div>
      </div>
    );
  }

  const superNav = [
    ["super_dashboard", "Super Dashboard", LayoutDashboard],
    ["super_pme", "PME clientes", Users],
    ["super_users", "Utilisateurs PME", Users],
    ["super_abonnements", "Abonnements", CreditCard],
    ["super_paiements", "Revenus SaaS", DollarSign],
    ["super_messages", "Messages PME", FileText],
    ["super_support", "Support", FileText],
    ["super_logs", "Logs & Audit", Settings],
    ["super_parametres", "Paramètres", Settings],
    ["super_sauvegardes", "Sauvegardes", Save],
    ["super_crm", "CRM Global", Users]
  ];

  const nav = [
    ["dashboard", "Tableau de bord", LayoutDashboard],
    ["ventes", "Ventes", ShoppingCart],
    ["factures", "Factures", FileText],
    ["devis", "Devis", FileText],
    ["depenses", "Dépenses", Wallet],
    ["stocks", "Produits / Stock", Package],
    ["achats", "Achats", Truck],
    ["clients", "Clients", Users],
    ["fournisseurs", "Fournisseurs", Truck],
    ["caisse", "Caisse", DollarSign],
    ["banque", "Banque", CreditCard],
    ["creances", "Créances", FileText],
    ["dettes", "Dettes", Wallet],
    ["utilisateurs", "Utilisateurs", Users],
    ["rapports", "Rapports", FileText],
    ["comptabilite", "Comptabilité", Wallet],
    ["rh", "Ressources Humaines", Users],
    ["data_ia", "Data & IA", TrendingUp],
    ["messagerie", "Messagerie", FileText],
    ["abonnement", "Abonnement", CreditCard],
    ["parametres", "Paramètres", Settings]
  ].filter(([key]) => can(key));



  function getAllProfilsFiltres() {
    const q = superUserSearch.trim().toLowerCase();
    return allProfils.filter(u => {
      const ent = allEntreprises.find(e => e.id === u.entreprise_id);
      return !q
        || String(u.nom_complet || "").toLowerCase().includes(q)
        || String(u.email || "").toLowerCase().includes(q)
        || String(u.poste || u.role || "").toLowerCase().includes(q)
        || String(ent?.nom || "").toLowerCase().includes(q);
    });
  }


  async function superChangerPosteUtilisateur(userId, poste) {
    // superChangerPosteUtilisateur_secured
    const cible = allProfils.find(x => x.id === userId) || utilisateurs.find(x => x.id === userId);
    if (cible && !peutGererUtilisateur(cible)) return setMessage("Action non autorisée sur un utilisateur d’une autre PME.");

    const { error } = await supabase.from("profils").update({ poste }).eq("id", userId);
    if (error) return showError(error, "Impossible de modifier le rôle utilisateur.");
    setMessage("Rôle utilisateur modifié.");
    chargerSuperAdminData();
  }

  async function superChangerStatutUtilisateur(userId, actif) {
    // superChangerStatutUtilisateur_secured
    const cible = allProfils.find(x => x.id === userId) || utilisateurs.find(x => x.id === userId);
    if (cible && !peutGererUtilisateur(cible)) return setMessage("Action non autorisée sur un utilisateur d’une autre PME.");

    const { error } = await supabase.from("profils").update({ actif }).eq("id", userId);
    if (error) return showError(error, "Impossible de modifier le statut utilisateur.");
    setMessage(actif ? "Utilisateur réactivé." : "Utilisateur désactivé.");
    chargerSuperAdminData();
  }

  async function superSaveProspect(e) {
    e.preventDefault();
    if (!superCrmProspectForm.nom.trim()) return setMessage("Nom prospect obligatoire.");
    const { error } = await supabase.from("prospects").insert({
      entreprise_id: entreprise?.id || allEntreprises[0]?.id || null,
      nom: superCrmProspectForm.nom.trim(),
      telephone: superCrmProspectForm.telephone ? `+221 ${String(superCrmProspectForm.telephone).replace(/^\\+221\\s?/, "")}` : null,
      email: superCrmProspectForm.email || null,
      source: superCrmProspectForm.source || "Plateforme SaaS",
      statut: superCrmProspectForm.statut,
      note: superCrmProspectForm.note || null
    });
    if (error) return showError(error, "Impossible de créer le prospect CRM.");
    setSuperCrmProspectForm({ nom: "", telephone: "", email: "", source: "", statut: "nouveau", note: "" });
    setMessage("Prospect CRM créé.");
    chargerDonnees();
  }

  async function superSaveCampagne(e) {
    e.preventDefault();
    if (!superCrmCampagneForm.nom.trim()) return setMessage("Nom campagne obligatoire.");
    const { error } = await supabase.from("campagnes").insert({
      entreprise_id: entreprise?.id || allEntreprises[0]?.id || null,
      nom: superCrmCampagneForm.nom.trim(),
      canal: superCrmCampagneForm.canal,
      message: superCrmCampagneForm.message || null,
      statut: superCrmCampagneForm.statut
    });
    if (error) return showError(error, "Impossible de créer la campagne.");
    setSuperCrmCampagneForm({ nom: "", canal: "whatsapp", message: "", statut: "brouillon" });
    setMessage("Campagne CRM créée.");
    chargerDonnees();
  }

  async function superSaveRelance(e) {
    e.preventDefault();
    if (!superCrmRelanceForm.prospect_id) return setMessage("Sélectionnez un prospect.");
    const { error } = await supabase.from("relances").insert({
      entreprise_id: entreprise?.id || allEntreprises[0]?.id || null,
      prospect_id: superCrmRelanceForm.prospect_id,
      objet: superCrmRelanceForm.objet || null,
      date_relance: superCrmRelanceForm.date_relance,
      statut: "a_faire",
      note: superCrmRelanceForm.note || null
    });
    if (error) return showError(error, "Impossible de créer la relance.");
    setSuperCrmRelanceForm({ prospect_id: "", objet: "", date_relance: today(), note: "" });
    setMessage("Relance CRM créée.");
    chargerDonnees();
  }


  function exporterSauvegardeJSON() {
    const data = {
      date: new Date().toISOString(),
      entreprise,
      produits,
      clients,
      fournisseurs,
      ventes,
      achats,
      depenses,
      caisses,
      banques,
      creances,
      dettes,
      employes,
      salaires,
      facturesSaas,
      paiementsSaas,
      logs
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sauvegarde_suivi_pme_${today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function enregistrerSauvegarde() {
    exporterSauvegardeJSON();
    const { error } = await supabase.from("sauvegardes").insert({
      entreprise_id: entreprise?.id || null,
      type_sauvegarde: "json",
      statut: "terminee",
      details: "Sauvegarde JSON téléchargée depuis l'application."
    });
    if (error) return showError(error, "Sauvegarde téléchargée mais non enregistrée dans l'historique.");
    await addLog("Sauvegarde", "Export JSON", "Sauvegarde complète téléchargée.");
    setMessage("Sauvegarde téléchargée et historisée.");
    chargerSuperAdminData();
  }

  function exporterDonneesExcelCSV() {
    downloadCSV("export_produits.csv", ["Produit","Quantité","Prix achat","Prix vente","Seuil"], produits.map(p => [p.nom, p.quantite, p.prix_achat, p.prix_vente, p.seuil_alerte]));
    downloadCSV("export_ventes.csv", ["Date","Référence","Produit","Client","Quantité","Prix","Total"], ventes.map(v => {
      const p = produits.find(x => x.id === v.produit_id);
      const c = clients.find(x => x.id === v.client_id);
      return [v.date_vente, factureReference(v), p?.nom || "—", c?.nom || "—", v.quantite, v.prix_unitaire, Number(v.quantite || 0) * Number(v.prix_unitaire || 0)];
    }));
    setMessage("Exports CSV générés.");
  }

  function imprimerCompteResultat() {
    const html = `<html><head><title>Compte de résultat</title><style>body{font-family:Arial;background:#f4f4f4;color:#152238}.page{width:850px;margin:24px auto;background:white;padding:36px;border-radius:12px}.head{border-bottom:4px solid #1E7F6E;padding-bottom:16px;margin-bottom:20px}table{width:100%;border-collapse:collapse;margin-top:20px}td,th{padding:12px;border-bottom:1px solid #e8eaee;text-align:left}.total{font-size:22px;font-weight:bold;color:#1E7F6E}@media print{body{background:#fff}.page{margin:0;width:auto}}</style></head><body><div class="page"><div class="head"><h1>Compte de résultat simplifié</h1><div>${safeText(entreprise?.nom || "Suivi PME")} — ${new Date().toLocaleDateString("fr-FR")}</div></div><table><tr><th>Élément</th><th>Montant</th></tr><tr><td>Chiffre d'affaires</td><td>${safeText(fmt(ca))}</td></tr><tr><td>Achats</td><td>${safeText(fmt(achatsTotal))}</td></tr><tr><td>Dépenses</td><td>${safeText(fmt(depTotal))}</td></tr><tr><td>Créances ouvertes</td><td>${safeText(fmt(totalCreances))}</td></tr><tr><td>Dettes ouvertes</td><td>${safeText(fmt(totalDettes))}</td></tr><tr><td class="total">Résultat net</td><td class="total">${safeText(fmt(resultatMensuel))}</td></tr></table><br/><div style="text-align:right">Signature / Cachet</div></div><script>window.print()</script></body></html>`;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
  }

  async function demanderPaiementMobile() {
    if (!entreprise?.id) return setMessage("Entreprise introuvable.");
    if (!paiementLocalForm.reference.trim()) return setMessage("Veuillez saisir la référence de paiement.");
    const { error } = await supabase.from("tickets_support").insert({
      entreprise_id: entreprise.id,
      sujet: `Validation paiement ${paiementLocalForm.moyen}`,
      message: `Paiement ${paiementLocalForm.moyen} à valider. Référence : ${paiementLocalForm.reference}. Montant : ${paiementLocalForm.montant || "non renseigné"}.`,
      priorite: "normale",
      statut: "ouvert"
    });
    if (error) return showError(error, "Impossible d'envoyer la demande de validation paiement.");
    await creerNotification({
      entreprise_id: entreprise.id,
      titre: "Paiement envoyé",
      message: `Votre paiement ${paiementLocalForm.moyen} est en attente de validation.`,
      type_notification: "info",
      canal: "application"
    });
    setPaiementLocalForm({ moyen: "Wave", reference: "", montant: String(ABONNEMENT_MENSUEL) });
    setMessage("Référence de paiement envoyée au Super Admin.");
  }

  async function demarrerEssaiGratuitPME(entrepriseId) {
    const plan = getPlanEssai();
    if (!plan) return setMessage("Plan Essai Gratuit introuvable.");
    const fin = new Date();
    fin.setDate(fin.getDate() + JOURS_ESSAI_ABONNEMENT);
    const { error } = await supabase.from("abonnements").insert({
      entreprise_id: entrepriseId,
      plan_id: plan.id,
      statut: "essai",
      date_fin: fin.toISOString().slice(0,10)
    });
    if (error) return showError(error, "Impossible de démarrer l'essai gratuit.");
    await supabase.from("entreprises").update({ statut_saas: "essai", abonnement_actif: true, date_debut_essai: today(), date_fin_abonnement: fin.toISOString().slice(0,10) }).eq("id", entrepriseId);
    await addLog("Abonnements", "Essai gratuit", `Essai gratuit 20 jours pour ${entrepriseId}`);
    setMessage("Essai gratuit 20 jours activé.");
    chargerSuperAdminData();
  }


  const messagesNonLus = messagerieSaas.filter(m => m.statut !== "lu" && (isSuperAdmin || m.destinataire_id === profil?.id || m.entreprise_id === entreprise?.id)).length;

  const mailQuery = String(mailSearch || "").trim().toLowerCase();
  const messagesScope = (messagerieSaas || []).filter((m) => {
    const visible = isSuperAdmin
      ? true
      : m.expediteur_id === profil?.id || m.destinataire_id === profil?.id || m.entreprise_id === entreprise?.id;
    const match = !mailQuery
      || String(m.sujet || "").toLowerCase().includes(mailQuery)
      || String(m.message || "").toLowerCase().includes(mailQuery)
      || String(m.statut || "").toLowerCase().includes(mailQuery);
    return visible && match;
  });

  const messagesRecus = messagesScope.filter((m) => isSuperAdmin ? m.expediteur_id !== profil?.id : m.destinataire_id === profil?.id);
  const messagesEnvoyes = messagesScope.filter((m) => m.expediteur_id === profil?.id);
  const messagesNonLusListe = messagesScope.filter((m) => m.statut !== "lu" && m.expediteur_id !== profil?.id);
  const messagesTraites = messagesScope.filter((m) => m.statut === "lu");

  const getMessagesByBox = (box = mailBox) => {
    if (box === "envoyes") return messagesEnvoyes;
    if (box === "non_lus") return messagesNonLusListe;
    if (box === "traites") return messagesTraites;
    if (box === "tous") return messagesScope;
    return messagesRecus;
  };

  function MailBoxButton({ id, label, count, active, onClick }) {
    return <button type="button" onClick={onClick} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, width:"100%", padding:"11px 12px", borderRadius:12, border:`1px solid ${active ? TEAL : INK + "12"}`, background: active ? `${TEAL}14` : "#fff", color: active ? TEAL : INK, cursor:"pointer", fontWeight:900, boxShadow: active ? `0 10px 22px ${TEAL}18` : "none" }}><span>{label}</span><span style={{ minWidth:28, textAlign:"center", borderRadius:999, padding:"3px 7px", background: active ? TEAL : `${INK}10`, color: active ? "#fff" : INK, fontSize:12 }}>{count}</span></button>;
  }

  function MessageCard({ m, superView = false }) {
    const exp = allProfils.find(p => p.id === m.expediteur_id) || utilisateurs.find(p => p.id === m.expediteur_id) || (m.expediteur_id === profil?.id ? profil : null);
    const ent = allEntreprises.find(e => e.id === m.entreprise_id) || entreprise;
    const isMine = m.expediteur_id === profil?.id;
    const nonLu = m.statut !== "lu" && !isMine;
    return <div style={{ background: nonLu ? `${MUSTARD}10` : "#fff", border:`1px solid ${nonLu ? MUSTARD + "55" : INK + "12"}`, borderRadius:16, padding:16, boxShadow:"0 1px 4px rgba(21,34,56,0.06)", marginBottom:12 }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
        <div style={{ minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ width:32, height:32, borderRadius:999, display:"inline-flex", alignItems:"center", justifyContent:"center", background: isMine ? `${TEAL}18` : `${INK}10`, color: isMine ? TEAL : INK, fontWeight:900 }}>{isMine ? "Moi" : (exp?.nom_complet || ent?.nom || "S").slice(0,1).toUpperCase()}</span>
            <strong style={{ fontSize:14, color:INK }}>{m.sujet || "Sans sujet"}</strong>
            {nonLu && <span style={{ fontSize:11, fontWeight:900, color:"#fff", background:CORAL, borderRadius:999, padding:"3px 8px" }}>Nouveau</span>}
            {isMine && <span style={{ fontSize:11, fontWeight:900, color:TEAL, background:`${TEAL}12`, borderRadius:999, padding:"3px 8px" }}>Envoyé</span>}
          </div>
          <div style={{ marginTop:6, color:`${INK}99`, fontSize:12.5 }}>
            {isMine ? "Vous" : (exp?.nom_complet || "Utilisateur PME")} {ent?.nom ? `• ${ent.nom}` : ""} • {m.created_at ? new Date(m.created_at).toLocaleString("fr-FR") : "—"}
          </div>
        </div>
        <span style={{ fontSize:12, fontWeight:900, color:m.statut === "lu" ? TEAL : MUSTARD, background:m.statut === "lu" ? `${TEAL}12` : `${MUSTARD}14`, borderRadius:999, padding:"5px 9px" }}>{m.statut === "lu" ? "Lu" : "Non lu"}</span>
      </div>
      <div style={{ whiteSpace:"pre-wrap", lineHeight:1.55, color:INK, marginTop:14, background:`${INK}05`, borderRadius:12, padding:12, fontSize:13 }}>{m.message}</div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:12 }}>
        {m.statut !== "lu" && <button onClick={() => marquerMessageLu(m.id)} style={linkBtn(TEAL)}>Marquer lu</button>}
        {!isMine && <button onClick={() => setReponseSaasForm({ id:m.id, message:"" })} style={linkBtn(INK)}>Répondre</button>}
        {isMine && <button onClick={() => modifierMessageSaas(m)} style={linkBtn(INK)}>Modifier</button>}
        <button onClick={() => supprimerMessageSaas(m.id)} style={linkBtn(CORAL)}>Supprimer</button>
      </div>
      {reponseSaasForm.id === m.id && <div style={{ marginTop:12, padding:12, borderRadius:12, background:`${TEAL}08`, border:`1px solid ${TEAL}22` }}><textarea style={{...inputStyle,width:"100%",minHeight:90,boxSizing:"border-box"}} value={reponseSaasForm.message} onChange={e=>setReponseSaasForm({...reponseSaasForm,message:e.target.value})} placeholder="Votre réponse..." /><div style={{display:"flex",gap:8,marginTop:8}}><Button type="button" onClick={() => repondreMessageSaas(m)}>Envoyer la réponse</Button><Button type="button" secondary onClick={() => setReponseSaasForm({id:null,message:""})}>Annuler</Button></div></div>}
    </div>;
  }

  async function envoyerMessageSaas(e) {
    e?.preventDefault?.();
    if (!messageSaasForm.sujet.trim() || !messageSaasForm.message.trim()) {
      return setMessage("Veuillez renseigner le sujet et le message.");
    }

    
    if (messageSaasForm.id) {
      const { error } = await supabase.from("messagerie_saas").update({
        sujet: messageSaasForm.sujet.trim(),
        message: messageSaasForm.message.trim()
      }).eq("id", messageSaasForm.id);

      if (error) return showError(error, "Impossible de modifier le message.");

      await addLog("Messagerie", "Message modifié", messageSaasForm.sujet);
      setMessageSaasForm({ id: null, sujet: "Demande de création utilisateur", message: "" });
      setMessageModal({ open: true, title: "Message modifié", message: "Votre message a été modifié avec succès." });
      setMessage("Message modifié avec succès.");
      chargerDonnees();
      chargerMessagerieSaas?.();
      return;
    }

const { error } = await supabase.from("messagerie_saas").insert({
      entreprise_id: entreprise?.id || profil?.entreprise_id || null,
      expediteur_id: profil?.id || null,
      destinataire_id: null,
      sujet: messageSaasForm.sujet.trim(),
      message: messageSaasForm.message.trim(),
      statut: "non_lu"
    });

    if (error) return showError(error, "Impossible d'envoyer le message.");

    await creerNotification({
      entreprise_id: entreprise?.id || profil?.entreprise_id,
      titre: "Nouveau message PME",
      message: messageSaasForm.sujet,
      type_notification: "message",
      canal: "application"
    });

    await addLog("Messagerie", "Message envoyé", messageSaasForm.sujet);
    setMessageSaasForm({ id: null, sujet: "Demande de création utilisateur", message: "" });
    setMessageModal({ open: true, title: "Message envoyé", message: "Votre message a été envoyé avec succès au Super Admin. Vous recevrez une notification dès qu’une réponse sera disponible." });
    setMessage("Message envoyé au Super Admin.");
    chargerDonnees();
    chargerSuperAdminData();
  }

  function preRemplirCreationUtilisateur() {
    setMessageSaasForm({
      sujet: "Demande de création utilisateur",
      message: "Bonjour, merci de créer un compte utilisateur :\\n\\nNom complet : \\nEmail : \\nTéléphone : \\nRôle souhaité : Caissier / Employé / Magasinier / Comptable\\n\\nMerci."
    });
  }


  function modifierMessageSaas(m) {
    setMessageSaasForm({ id: m.id, sujet: m.sujet || "Autre demande", message: m.message || "" });
    setTab("messagerie");
    setMessage("Vous pouvez modifier le message dans le formulaire ci-dessus.");
  }

  async function supprimerMessageSaas(id) {
    if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;
    const { error } = await supabase.from("messagerie_saas").delete().eq("id", id);
    if (error) return showError(error, "Impossible de supprimer le message.");
    await addLog("Messagerie", "Message supprimé", `Message ID ${id}`);
    setMessageModal({ open: true, title: "Message supprimé", message: "Le message a été supprimé avec succès." });
    chargerDonnees();
    chargerMessagerieSaas?.();
    chargerSuperAdminData();
  }

  async function marquerMessageLu(id) {
    const { error } = await supabase.from("messagerie_saas").update({ statut: "lu" }).eq("id", id);
    if (error) return showError(error, "Impossible de marquer le message comme lu.");
    chargerDonnees();
    chargerSuperAdminData();
  }

  async function repondreMessageSaas(original) {
    if (!reponseSaasForm.message.trim()) return setMessage("Veuillez saisir une réponse.");
    const { error } = await supabase.from("messagerie_saas").insert({
      entreprise_id: original.entreprise_id,
      expediteur_id: profil?.id || null,
      destinataire_id: original.expediteur_id || null,
      sujet: `Réponse : ${original.sujet}`,
      message: reponseSaasForm.message.trim(),
      statut: "non_lu"
    });
    if (error) return showError(error, "Impossible d'envoyer la réponse.");

    await supabase.from("messagerie_saas").update({ statut: "lu" }).eq("id", original.id);

    await creerNotification({
      entreprise_id: original.entreprise_id,
      utilisateur_id: original.expediteur_id || null,
      titre: "Réponse du Super Admin",
      message: `Réponse à votre message : ${original.sujet}`,
      type_notification: "message",
      canal: "application"
    });

    await addLog("Messagerie", "Réponse Super Admin", original.sujet);
    setReponseSaasForm({ id: null, message: "" });
    setMessage("Réponse envoyée.");
    chargerDonnees();
    chargerSuperAdminData();
  }

  if (superAdminMode && isSuperAdmin) {
    return <div className={dashboardMasque ? "dash-hidden" : ""} style={{ display: "flex", minHeight: "100vh", background: themeBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif", color: themeText }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .kpi-card { transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease; }
        .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 18px 38px rgba(15,23,42,.11) !important; }
        .dash-hidden .kpi-card { display: none !important; }
        .dash-toggle-btn:hover { transform: translateY(-1px); box-shadow: 0 16px 30px rgba(15,23,42,.20) !important; }
        table { font-family: Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif; }
      `}</style>
      <button
        type="button"
        className="dash-toggle-btn"
        onClick={() => setDashboardMasque(v => !v)}
        style={{ position: "fixed", right: 22, bottom: 22, zIndex: 3000, display: "inline-flex", alignItems: "center", gap: 8, border: "none", borderRadius: 999, padding: "11px 15px", background: dashboardMasque ? TEAL : INK, color: "#fff", fontWeight: 900, fontSize: 12.5, cursor: "pointer", boxShadow: "0 12px 24px rgba(15,23,42,.18)" }}
        title={dashboardMasque ? "Voir les tableaux de bord" : "Masquer les tableaux de bord"}
      >
        <span style={{fontSize:15}}>{dashboardMasque ? "👁️" : "🙈"}</span>
        {dashboardMasque ? "Voir tableaux de bord" : "Masquer tableaux de bord"}
      </button>
      <style>{`
        @keyframes blinkMessage {
          0% { box-shadow: 0 0 0 0 rgba(224,145,60,0.75); background: rgba(224,145,60,0.28); }
          50% { box-shadow: 0 0 0 8px rgba(224,145,60,0.05); background: rgba(30,127,110,0.28); }
          100% { box-shadow: 0 0 0 0 rgba(224,145,60,0.75); background: rgba(224,145,60,0.28); }
        }
        .menu-message-blink {
          animation: blinkMessage 1s infinite;
          border-radius: 9px;
        }
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap'); input:focus,select:focus,textarea:focus{border-color:${themeAccent}!important;box-shadow:0 0 0 3px ${themeAccent}22!important}`}</style>
      <aside style={{ width: 250, background: themeSidebar, padding: "22px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"0 8px 18px"}}>
          <img src={logoSuiviPME} alt="Suivi PME" style={{width:44,height:44,borderRadius:12,objectFit:"cover",background:"#fff"}}/>
          <div><div style={{ color:"#fff", fontFamily:"Sora", fontWeight:900, fontSize:16 }}>SaaS Super Admin</div><div style={{color:"#ffffff99",fontSize:11}}>Suivi PME</div></div>
        </div>
        {superNav.map(([key,label,Icon]) => <NavItem key={key} icon={Icon} label={label} active={superTab===key} onClick={()=>setSuperTab(key)} className={key==="super_messages" && messagesNonLus > 0 ? "menu-message-blink" : ""} />)}
        <div style={{ marginTop:"auto", borderTop:"1px solid #ffffff1a", paddingTop:12 }}>
          <Button secondary onClick={()=>{ setSuperAdminMode(false); setTab("dashboard"); }}>Retour espace PME</Button>
          <button onClick={() => supabase.auth.signOut()} style={{ display:"flex",alignItems:"center",gap:6,background:"none",border:"none",color:"#ffffff88",fontSize:12,marginTop:12,cursor:"pointer" }}><LogOut size={13}/> Déconnexion</button>
        </div>
      </aside>
      <main style={{ flex:1, padding:"28px 38px", maxWidth:1320 }}>
        {message && <div style={{ background: message.includes("créé") || message.includes("modifié") ? `${TEAL}12` : `${CORAL}12`, color: message.includes("créé") || message.includes("modifié") ? TEAL : CORAL, border: `1px solid ${INK}15`, padding: "10px 14px", borderRadius: 9, marginBottom: 14, fontSize: 13 }}>{message}</div>}


        {messageModal.open && <div style={{position:"fixed",inset:0,background:"rgba(21,34,56,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:20}}>
          <div style={{background:"#fff",borderRadius:18,padding:26,maxWidth:430,width:"100%",boxShadow:"0 30px 90px rgba(21,34,56,0.28)",border:`1px solid ${INK}14`,textAlign:"center"}}>
            <div style={{fontSize:38,marginBottom:10}}>✅</div>
            <h2 style={{margin:"0 0 8px",fontFamily:"Sora, sans-serif",color:INK}}>{messageModal.title}</h2>
            <p style={{color:`${INK}AA`,fontSize:14,lineHeight:1.5}}>{messageModal.message}</p>
            <Button onClick={()=>setMessageModal({open:false,title:"",message:""})}>OK</Button>
          </div>
        </div>}

        {superTab === "super_dashboard" && <><SectionTitle title="Dashboard Super Admin" sub="Vue globale SaaS : PME, utilisateurs, revenus, abonnements et support." /><div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}><KpiCard label="PME clientes" value={pmeClientesSaas.length} icon={Users} accent={TEAL}/><KpiCard label="Utilisateurs" value={allProfils.length} icon={Users} accent={INK}/><KpiCard label="Abonnements actifs" value={abonnementsActifs} icon={CreditCard} accent={MUSTARD}/><KpiCard label="Revenus mois" value={fmt(revenusSaasMois)} icon={DollarSign} accent={TEAL}/><KpiCard label="Revenus année" value={fmt(revenusSaasAnnee)} icon={DollarSign} accent={INK}/><KpiCard label="Tickets ouverts" value={ticketsOuverts} icon={FileText} accent={CORAL}/></div><Table headers={["PME","Code","Création","Utilisateurs","Abonnement"]}>{pmeClientesSaas.slice(0,20).map(e=>{const nb=allProfils.filter(p=>p.entreprise_id===e.id).length; const ab=abonnements.find(a=>a.entreprise_id===e.id); const pl=plans.find(p=>p.id===ab?.plan_id); return <tr key={e.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{e.nom}</td><td style={cell}>{e.code_entreprise||codeCourt("ENT",e.id)}</td><td style={cell}>{e.created_at ? new Date(e.created_at).toLocaleDateString("fr-FR") : "—"}</td><td style={cell}>{nb}</td><td style={cell}>{pl?.nom || "—"}</td></tr>})}</Table></>}

        {superTab === "super_pme" && <>
        {isSuperAdmin && <div style={{background:`${MUSTARD}12`,border:`1px solid ${MUSTARD}44`,borderRadius:12,padding:16,marginBottom:18}}>
          <SectionTitle title="Utilisateurs en attente de rattachement" sub="Ces utilisateurs doivent être rattachés manuellement à une PME." />
          {usersNonRattaches.length === 0 && <div style={{fontSize:13,marginBottom:12,color:`${INK}AA`}}>Aucun utilisateur en attente pour le moment.</div>}<form onSubmit={rattacherUserAPME} style={formStyle("#fff", INK)}>
            <Field label="Utilisateur"><select required style={{...inputStyle,minWidth:300}} value={rattachementForm.user_id} onChange={e=>setRattachementForm({...rattachementForm,user_id:e.target.value})}><option value="">Sélectionner un utilisateur créé/en attente</option>{usersNonRattaches.map(u=><option key={u.id} value={u.id}>{u.nom_complet || u.email || u.id} — {u.email || "sans email"} — En attente</option>)}</select></Field>
            <Field label="PME de rattachement"><select required style={{...inputStyle,minWidth:240}} value={rattachementForm.entreprise_id} onChange={e=>setRattachementForm({...rattachementForm,entreprise_id:e.target.value})}><option value="">Aucune PME pour le moment — mettre en attente</option>{allEntreprises.filter(e=>e.code_entreprise!=="ENT-SUPER").map(e=><option key={e.id} value={e.id}>{e.nom}</option>)}</select></Field>
            <Field label="Rôle"><select style={inputStyle} value={rattachementForm.poste} onChange={e=>setRattachementForm({...rattachementForm,poste:e.target.value})}><option value="gerant">Gérant</option><option value="employe">Employé</option><option value="caissier">Caissier</option><option value="magasinier">Magasinier</option><option value="comptable">Comptable</option></select></Field>
            <Button type="submit">Rattacher à la PME</Button>
          </form>
        </div>}
<SectionTitle title="Administration des PME clientes" sub="Créez, modifiez, activez/suspendez les PME et gérez les utilisateurs de chaque PME." /><div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}><KpiCard label="PME clientes" value={pmeClientesSaas.length} icon={Users} accent={TEAL}/><KpiCard label="Actives" value={allEntreprises.filter(e=>(e.statut_saas||"actif")==="actif").length} icon={TrendingUp} accent={INK}/><KpiCard label="Suspendues" value={allEntreprises.filter(e=>["suspendu","lecture_seule","expire"].includes(e.statut_saas)).length} icon={AlertTriangle} accent={CORAL}/></div><div style={{background:`${TEAL}10`,border:`1px solid ${TEAL}33`,borderRadius:10,padding:12,marginBottom:14,fontSize:13}}><b>Initialisation automatique :</b> chaque nouvelle PME démarre à zéro : 0 produit, 0 vente, 0 achat, 0 client, 0 fournisseur.</div><form onSubmit={superCreerPME} style={formStyle(CARD, INK)}><Field label="Nom PME"><input required style={{...inputStyle,minWidth:220}} value={superPmeForm.nom} onChange={e=>setSuperPmeForm({...superPmeForm,nom:e.target.value})}/></Field><Field label="Téléphone"><PhoneSNInput value={superPmeForm.telephone} onChange={v=>setSuperPmeForm({...superPmeForm,telephone:v})} style={inputStyle}/></Field><Field label="Email"><input type="email" style={{...inputStyle,minWidth:190}} value={superPmeForm.email} onChange={e=>setSuperPmeForm({...superPmeForm,email:e.target.value})}/></Field><Field label="Adresse"><input style={{...inputStyle,minWidth:220}} value={superPmeForm.adresse} onChange={e=>setSuperPmeForm({...superPmeForm,adresse:e.target.value})}/></Field><Field label="NINEA"><input style={{...inputStyle,minWidth:130}} value={superPmeForm.ninea} onChange={e=>setSuperPmeForm({...superPmeForm,ninea:e.target.value})}/></Field><Field label="RCCM"><input style={{...inputStyle,minWidth:130}} value={superPmeForm.rccm} onChange={e=>setSuperPmeForm({...superPmeForm,rccm:e.target.value})}/></Field><Field label="Plan"><select style={{...inputStyle,minWidth:170}} value={superPmeForm.plan_id} onChange={e=>setSuperPmeForm({...superPmeForm,plan_id:e.target.value})}><option value="">Aucun plan</option>{plansAbonnementVisibles.map(p=><option key={p.id} value={p.id} disabled={String(p.id).startsWith("local-")}>{p.nom} — {fmt(p.prix_mensuel)}</option>)}</select></Field><Field label="Fin abonnement"><input type="date" style={inputStyle} value={superPmeForm.date_fin} onChange={e=>setSuperPmeForm({...superPmeForm,date_fin:e.target.value})}/></Field><div style={{flexBasis:"100%",background:`${MUSTARD}10`,border:`1px solid ${MUSTARD}33`,borderRadius:12,padding:14,marginTop:6}}>
      <label style={{display:"flex",alignItems:"center",gap:8,fontWeight:900,color:INK}}>
        <input type="checkbox" checked={premierGerantForm.creer} onChange={e=>setPremierGerantForm({...premierGerantForm,creer:e.target.checked})}/>
        Créer le premier gérant de cette PME
      </label>
      {premierGerantForm.creer && <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:12}}>
        <Field label="Nom complet gérant"><input required style={{...inputStyle,minWidth:220}} value={premierGerantForm.nom_complet} onChange={e=>setPremierGerantForm({...premierGerantForm,nom_complet:e.target.value})}/></Field>
        <Field label="Email gérant"><input required type="email" style={{...inputStyle,minWidth:220}} value={premierGerantForm.email} onChange={e=>setPremierGerantForm({...premierGerantForm,email:e.target.value})}/></Field>
        <Field label="Téléphone gérant"><PhoneSNInput value={premierGerantForm.telephone} onChange={v=>setPremierGerantForm({...premierGerantForm,telephone:v})} style={inputStyle}/></Field>
        <Field label="Mot de passe temporaire"><input type="text" style={{...inputStyle,minWidth:190}} placeholder="Auto si vide" value={premierGerantForm.mot_de_passe} onChange={e=>setPremierGerantForm({...premierGerantForm,mot_de_passe:e.target.value})}/></Field>
      </div>}
      <div style={{fontSize:12.5,color:`${INK}AA`,marginTop:8}}>Le gérant sera rattaché automatiquement à cette PME avec le rôle <b>Gérant</b>.</div>
    </div><Button type="submit"><Plus size={15}/> Créer PME cliente</Button></form><Table headers={["PME","Code","Statut","Invitation","Téléphone","Email","NINEA","RCCM","Users","Plan","Actions"]}>{allEntreprises.map(e=>{const users=allProfils.filter(p=>p.entreprise_id===e.id); const ab=abonnements.find(a=>a.entreprise_id===e.id); const pl=plans.find(p=>p.id===ab?.plan_id); return <tr key={e.id} style={{borderTop:`1px solid ${INK}0D`,background:selectedPmeAdmin?.id===e.id?`${TEAL}10`:"transparent"}}><td style={{...cell,fontWeight:800}}>{e.nom}</td><td style={cell}>{e.code_entreprise||codeCourt("ENT",e.id)}</td><td style={cell}><span style={{fontWeight:800,color:(e.statut_saas||"actif")==="actif"?TEAL:CORAL}}>{e.statut_saas||"actif"}</span></td><td style={cell}><span style={{fontWeight:800}}>{e.code_invitation}</span> <button onClick={()=>{navigator.clipboard?.writeText(e.code_invitation); setMessage("Code invitation copié.");}} style={linkBtn(TEAL)}>Copier</button></td><td style={cell}>{e.telephone||"—"}</td><td style={cell}>{e.email||"—"}</td><td style={cell}>{e.ninea||"—"}</td><td style={cell}>{e.rccm||"—"}</td><td style={cell}>{users.length}</td><td style={cell}>{isEntrepriseSysteme(e)?<span style={{fontWeight:900,color:TEAL}}>Plateforme système — abonnement exclu</span>:(pl?.nom||"—")}</td><td style={cell}><button onClick={()=>ouvrirAdministrationPME(e)} style={linkBtn(TEAL)}>Administrer</button>{!isEntrepriseSysteme(e) && ((e.statut_saas||"actif")==="actif"?<button onClick={()=>changerStatutPME(e.id,"suspendu")} style={linkBtn(CORAL)}>Suspendre</button>:<button onClick={()=>changerStatutPME(e.id,"actif")} style={linkBtn(TEAL)}>Activer</button>)}</td></tr>})}</Table>{selectedPmeAdmin && <div style={{marginTop:22,background:CARD,border:`1px solid ${INK}12`,borderRadius:14,padding:18}}><SectionTitle title={`Administration : ${selectedPmeAdmin.nom}`} sub="Modifiez la PME sélectionnée et gérez ses utilisateurs/rôles." /><form onSubmit={sauvegarderPMEAdmin} style={formStyle("#fff", INK)}><Field label="Nom PME"><input required style={{...inputStyle,minWidth:220}} value={editPmeForm.nom} onChange={e=>setEditPmeForm({...editPmeForm,nom:e.target.value})}/></Field><Field label="Téléphone"><input style={{...inputStyle,minWidth:160}} value={editPmeForm.telephone} onChange={e=>setEditPmeForm({...editPmeForm,telephone:e.target.value})}/></Field><Field label="Email"><input type="email" style={{...inputStyle,minWidth:190}} value={editPmeForm.email} onChange={e=>setEditPmeForm({...editPmeForm,email:e.target.value})}/></Field><Field label="Adresse"><input style={{...inputStyle,minWidth:220}} value={editPmeForm.adresse} onChange={e=>setEditPmeForm({...editPmeForm,adresse:e.target.value})}/></Field><Field label="NINEA"><input style={{...inputStyle,minWidth:130}} value={editPmeForm.ninea} onChange={e=>setEditPmeForm({...editPmeForm,ninea:e.target.value})}/></Field><Field label="RCCM"><input style={{...inputStyle,minWidth:130}} value={editPmeForm.rccm} onChange={e=>setEditPmeForm({...editPmeForm,rccm:e.target.value})}/></Field><Field label="Statut SaaS"><select style={inputStyle} value={editPmeForm.statut_saas} onChange={e=>setEditPmeForm({...editPmeForm,statut_saas:e.target.value})}><option value="actif">Actif</option><option value="essai">Essai</option><option value="lecture_seule">Lecture seule</option><option value="suspendu">Suspendu</option><option value="expire">Expiré</option></select></Field><Button type="submit">Enregistrer modifications PME</Button><Button type="button" secondary onClick={()=>setSelectedPmeAdmin(null)}>Fermer</Button></form><SectionTitle title="Utilisateurs de cette PME" /><Table headers={["Nom","Email","Téléphone","Rôle","Statut","Créé par","Actions"]}>{allProfils.filter(u=>u.entreprise_id===selectedPmeAdmin.id && u.poste!=="super_admin").map(u=>{const createur=allProfils.find(p=>p.id===u.created_by); const actif=u.actif!==false; return <tr key={u.id} style={{borderTop:`1px solid ${INK}0D`,background:!actif?`${CORAL}08`:"transparent"}}><td style={{...cell,fontWeight:800}}>{u.nom_complet||"—"}</td><td style={cell}>{u.email||"—"}</td><td style={cell}>{u.telephone||"—"}</td><td style={cell}><select style={inputStyle} value={u.poste||u.role||"employe"} onChange={e=>changerRoleUserPME(u.id,e.target.value)}><option value="gerant">Gérant</option><option value="employe">Employé</option><option value="caissier">Caissier</option><option value="magasinier">Magasinier</option><option value="comptable">Comptable</option></select></td><td style={cell}><span style={{fontWeight:800,color:actif?TEAL:CORAL}}>{actif?"Actif":"Désactivé"}</span></td><td style={cell}>{createur?.nom_complet||"—"}</td><td style={cell}>{actif?<button onClick={()=>changerStatutUserPME(u.id,false)} style={linkBtn(CORAL)}>Désactiver</button>:<button onClick={()=>changerStatutUserPME(u.id,true)} style={linkBtn(TEAL)}>Activer</button>}<button onClick={()=>supprimerUtilisateurAdmin(u.id)} style={linkBtn(CORAL)}>Supprimer</button></td></tr>})}</Table></div>}</>}

        {superTab === "super_users" && <><div style={{background:`${MUSTARD}12`,border:`1px solid ${MUSTARD}44`,borderRadius:10,padding:12,marginBottom:14,fontSize:13}}><b>Rattachement utilisateur :</b> si aucune PME n’est choisie, l’utilisateur est placé en attente et une alerte apparaît dans l’espace Super Admin pour le rattacher.</div>
        
        {superTab === "super_users" && <div style={{background:CARD,border:`1px solid ${INK}10`,borderRadius:14,padding:16,marginBottom:18}}>
          <SectionTitle title="Créer un utilisateur" sub="Choisissez une PME si elle est connue. Sinon l'utilisateur ira en attente de rattachement." />
          <div style={{background:`${MUSTARD}12`,border:`1px solid ${MUSTARD}44`,borderRadius:10,padding:12,marginBottom:12,fontSize:13}}>
            <b>Important :</b> si aucune PME n’est choisie, l’utilisateur ne sera pas rattaché à Boutique theo. Il sera placé en attente dans « Utilisateurs en attente de rattachement ».
          </div>
          <form onSubmit={creerProfilEnAttente} style={formStyle("#fff", INK)}>
            <Field label="PME de rattachement"><select style={{...inputStyle,minWidth:280}} value={newUserForm.entreprise_id || ""} onChange={e=>setNewUserForm({...newUserForm,entreprise_id:e.target.value})}><option value="">Aucune PME pour le moment — mettre en attente</option>{allEntreprises.filter(e=>e.code_entreprise!=="ENT-SUPER").map(e=><option key={e.id} value={e.id}>{e.nom}</option>)}</select></Field>
            <Field label="Nom complet"><input required style={{...inputStyle,minWidth:220}} value={newUserForm.nom_complet} onChange={e=>setNewUserForm({...newUserForm,nom_complet:e.target.value})}/></Field>
            <Field label="Email"><input required type="email" style={{...inputStyle,minWidth:220}} value={newUserForm.email} onChange={e=>setNewUserForm({...newUserForm,email:e.target.value})}/></Field>
            <Field label="Téléphone"><PhoneSNInput value={newUserForm.telephone} onChange={v=>setNewUserForm({...newUserForm,telephone:v})} style={inputStyle}/></Field>
            <Field label="Rôle/Poste"><select style={inputStyle} value={newUserForm.poste} onChange={e=>setNewUserForm({...newUserForm,poste:e.target.value})}><option value="gerant">Gérant</option><option value="employe">Employé</option><option value="caissier">Caissier</option><option value="magasinier">Magasinier</option><option value="comptable">Comptable</option></select></Field>
            <Button type="submit"><Plus size={15}/> Créer utilisateur</Button>
          </form>
        </div>}
        <SectionTitle title="Gestion globale des utilisateurs PME" sub="Gérez les gérants, employés, caissiers, magasiniers, comptables et accès par entreprise." /><div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}><KpiCard label="Utilisateurs" value={allProfils.length} icon={Users} accent={TEAL}/><KpiCard label="Gérants" value={allProfils.filter(u=>(u.poste||u.role)==="gerant").length} icon={Users} accent={INK}/><KpiCard label="Caissiers" value={allProfils.filter(u=>(u.poste||u.role)==="caissier").length} icon={ShoppingCart} accent={MUSTARD}/><KpiCard label="Super Admin" value={allProfils.filter(u=>u.poste==="super_admin").length} icon={Settings} accent={CORAL}/></div><div style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:16,marginBottom:18}}><Field label="Rechercher utilisateur / entreprise / rôle"><input style={{...inputStyle,minWidth:320}} placeholder="Nom, email, rôle ou PME" value={superUserSearch} onChange={e=>setSuperUserSearch(e.target.value)}/></Field></div><Table headers={["Utilisateur","Email","Entreprise","Rôle/Poste","Statut","Création","Actions"]}>{getAllProfilsFiltres().map(u=>{const ent=allEntreprises.find(e=>e.id===u.entreprise_id); const role=u.poste||u.role||"employe"; const actif=u.actif!==false; return <tr key={u.id} style={{borderTop:`1px solid ${INK}0D`,background:!actif?`${CORAL}08`:"transparent"}}><td style={cell}>{u.nom_complet||"Utilisateur"}</td><td style={cell}>{u.email||"—"}</td><td style={cell}>{ent?.nom||"—"}</td><td style={cell}><select style={inputStyle} value={role} onChange={e=>superChangerPosteUtilisateur(u.id,e.target.value)}><option value="gerant">Gérant</option><option value="caissier">Caissier</option><option value="magasinier">Magasinier</option><option value="comptable">Comptable</option><option value="employe">Employé</option><option value="super_admin">Super Admin</option></select></td><td style={cell}><span style={{fontWeight:800,color:actif?TEAL:CORAL}}>{actif?"Actif":"Désactivé"}</span></td><td style={cell}>{u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR") : "—"}</td><td style={cell}><button onClick={()=>superChangerStatutUtilisateur(u.id,!actif)} style={linkBtn(actif?CORAL:TEAL)}>{actif?"Désactiver":"Réactiver"}</button></td></tr>})}</Table></>}


        {superTab === "super_abonnements" && <><SectionTitle title="Abonnements SaaS" sub="Offre unique : essai gratuit 20 jours puis abonnement mensuel à 25 000 FCFA." />
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16,marginBottom:18}}>
            <div style={{background:"linear-gradient(135deg,#ECFDF5,#FFFFFF)",border:`1px solid ${TEAL}33`,borderRadius:18,padding:20,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",right:-30,top:-30,width:110,height:110,borderRadius:"50%",background:`${TEAL}12`}} />
              <div style={{fontSize:34,marginBottom:8}}>🎁</div>
              <h3 style={{margin:"0 0 6px",color:INK}}>Essai Gratuit</h3>
              <div style={{fontSize:28,fontWeight:900,color:TEAL}}>{fmt(0)}</div>
              <p style={{color:`${INK}99`,fontSize:13,lineHeight:1.6}}>20 jours d'accès pour tester Suivi PME avec les modules essentiels.</p>
              <ul style={{margin:"12px 0 0",paddingLeft:18,fontSize:13,lineHeight:1.9,color:INK}}><li>20 jours d'essai</li><li>Jusqu'à 2 utilisateurs</li><li>Jusqu'à 100 produits</li><li>Messagerie support</li></ul>
            </div>
            <div style={{background:"linear-gradient(135deg,#EFF6FF,#FFFFFF)",border:`1px solid #2563EB44`,borderRadius:18,padding:20,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",right:-30,top:-30,width:110,height:110,borderRadius:"50%",background:"#2563EB12"}} />
              <div style={{fontSize:34,marginBottom:8}}>👑</div>
              <h3 style={{margin:"0 0 6px",color:INK}}>Abonnement Mensuel</h3>
              <div style={{fontSize:28,fontWeight:900,color:"#2563EB"}}>{fmt(ABONNEMENT_MENSUEL)} <span style={{fontSize:14}}> / mois</span></div>
              <p style={{color:`${INK}99`,fontSize:13,lineHeight:1.6}}>Formule complète pour gérer les ventes, stocks, caisse, dépenses, RH, rapports et utilisateurs.</p>
              <ul style={{margin:"12px 0 0",paddingLeft:18,fontSize:13,lineHeight:1.9,color:INK}}><li>Accès à tous les modules</li><li>Utilisateurs illimités</li><li>Produits illimités</li><li>Support prioritaire</li></ul>
            </div>
            <div style={{background:CARD,border:`1px solid ${INK}12`,borderRadius:18,padding:18}}>
              <SectionTitle title="Suivi global" />
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}><KpiCard label="PME abonnables" value={entreprisesAbonnables.length} icon={Users} accent={TEAL}/><KpiCard label="Abonnements" value={abonnementsAffiches.length} icon={CreditCard} accent={INK}/><KpiCard label="Alertes 5 jours" value={abonnementsExpireBientot} icon={AlertTriangle} accent={abonnementsExpireBientot?CORAL:TEAL}/><KpiCard label="Prix mensuel" value={fmt(ABONNEMENT_MENSUEL)} icon={DollarSign} accent={MUSTARD}/></div>
            </div>
          </div>
          <div style={{background:`${MUSTARD}10`,border:`1px solid ${MUSTARD}33`,borderRadius:14,padding:14,marginBottom:18,fontSize:13,lineHeight:1.6}}><b>Règle automatique :</b> toute nouvelle PME démarre en essai gratuit 20 jours. Une alerte est prévue 5 jours avant l'échéance. Si aucune validation de paiement n'est faite après expiration, la PME peut être suspendue jusqu'au renouvellement.</div>
          <div style={{background:CARD,border:`1px solid ${INK}12`,borderRadius:18,padding:18,marginBottom:18}}><SectionTitle title="Créer / renouveler un abonnement" sub="Sélectionnez une PME cliente, puis l'offre à appliquer." /><form onSubmit={saveAbonnement} style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}><Field label="Entreprise"><select required style={{...inputStyle,minWidth:240}} value={abonnementForm.entreprise_id} onChange={e=>setAbonnementForm({...abonnementForm,entreprise_id:e.target.value})}><option value="">Sélectionner une PME</option>{entreprisesAbonnables.map(e=><option key={e.id} value={e.id}>{e.nom}</option>)}</select></Field><Field label="Formule"><select required style={{...inputStyle,minWidth:210}} value={abonnementForm.plan_id} onChange={e=>setAbonnementForm({...abonnementForm,plan_id:e.target.value})}><option value="">Sélectionner</option>{plansAbonnementVisibles.map(p=><option key={p.id} value={p.id} disabled={String(p.id).startsWith("local-")}>{p.nom} — {fmt(p.prix_mensuel)}</option>)}</select></Field><Field label="Statut"><select style={inputStyle} value={abonnementForm.statut} onChange={e=>setAbonnementForm({...abonnementForm,statut:e.target.value})}><option value="essai">Essai</option><option value="actif">Actif</option><option value="suspendu">Suspendu</option><option value="expire">Expiré</option></select></Field><Field label="Date fin"><input type="date" style={inputStyle} value={abonnementForm.date_fin} onChange={e=>setAbonnementForm({...abonnementForm,date_fin:e.target.value})}/></Field><Button type="submit">Valider abonnement</Button></form></div>
          <Table headers={["Entreprise","Formule","Statut","Début","Fin","Jours restants","Actions"]}>{abonnementsAffiches.map(a=>{const e=allEntreprises.find(x=>x.id===a.entreprise_id); const p=plans.find(x=>x.id===a.plan_id); const fin=a.date_fin || e?.date_fin_abonnement; const jours=fin?Math.ceil((new Date(`${fin}T23:59:59`).getTime()-new Date().getTime())/(1000*60*60*24)):null; const expired=jours!==null && jours<0; return <tr key={a.id} style={{borderTop:`1px solid ${INK}0D`,background:expired?`${CORAL}08`:jours!==null&&jours<=JOURS_ALERTE_ABONNEMENT?`${MUSTARD}10`:"transparent"}}><td style={{...cell,fontWeight:900}}>{e?.nom||"—"}</td><td style={cell}>{p?.nom||"—"}</td><td style={{...cell,fontWeight:900,color:a.statut==="actif"||a.statut==="essai"?TEAL:CORAL}}>{a.statut}</td><td style={cell}>{a.date_debut||"—"}</td><td style={cell}>{fin||"—"}</td><td style={{...cell,fontWeight:900,color:expired?CORAL:jours!==null&&jours<=JOURS_ALERTE_ABONNEMENT?MUSTARD:TEAL}}>{jours===null?"—":expired?"Expiré":`${jours} j`}</td><td style={cell}>{a.statut==="actif"?<button onClick={()=>changerStatutAbonnement(a.id,"suspendu")} style={linkBtn(CORAL)}>Suspendre</button>:<button onClick={()=>changerStatutAbonnement(a.id,"actif")} style={linkBtn(TEAL)}>Activer</button>}</td></tr>})}</Table></>}


        {superTab === "super_paiements" && <><SectionTitle title="Paiements SaaS & Revenus" /><div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}><KpiCard label="Revenus mois" value={fmt(revenusSaasMois)} icon={DollarSign} accent={TEAL}/><KpiCard label="Revenus année" value={fmt(revenusSaasAnnee)} icon={DollarSign} accent={INK}/><KpiCard label="Paiements" value={paiementsSaas.length} icon={CreditCard} accent={MUSTARD}/></div><Table headers={["Date","Entreprise","Montant","Mode","Référence","Statut"]}>{paiementsSaas.map(p=>{const e=allEntreprises.find(x=>x.id===p.entreprise_id);return <tr key={p.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{p.date_paiement}</td><td style={cell}>{e?.nom||"—"}</td><td style={{...cell,color:TEAL,fontWeight:800}}>{fmt(p.montant)}</td><td style={cell}><PaymentBadge mode={p.mode_paiement || "Espèces"} /></td><td style={cell}>{p.reference||"—"}</td><td style={cell}>{p.statut}</td></tr>})}</Table></>}


        {superTab === "super_messages" && <><SectionTitle title="Messagerie Super Admin" sub="Boîte type Gmail : reçus, envoyés, non lus et traités." />
          <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:18,alignItems:"start"}}>
            <div style={{background:CARD,border:`1px solid ${INK}12`,borderRadius:18,padding:16,boxShadow:"0 1px 4px rgba(21,34,56,0.06)"}}>
              <div style={{fontWeight:900,color:INK,marginBottom:12}}>Dossiers</div>
              <div style={{display:"grid",gap:8}}>
                <MailBoxButton id="recus" label="Messages reçus" count={messagesRecus.length} active={superMailBox==="recus"} onClick={()=>setSuperMailBox("recus")} />
                <MailBoxButton id="envoyes" label="Messages envoyés" count={messagesEnvoyes.length} active={superMailBox==="envoyes"} onClick={()=>setSuperMailBox("envoyes")} />
                <MailBoxButton id="non_lus" label="Non lus" count={messagesNonLusListe.length} active={superMailBox==="non_lus"} onClick={()=>setSuperMailBox("non_lus")} />
                <MailBoxButton id="traites" label="Traités / lus" count={messagesTraites.length} active={superMailBox==="traites"} onClick={()=>setSuperMailBox("traites")} />
                <MailBoxButton id="tous" label="Tous les échanges" count={messagesScope.length} active={superMailBox==="tous"} onClick={()=>setSuperMailBox("tous")} />
              </div>
            </div>
            <div>
              <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:16}}><KpiCard label="Messages visibles" value={messagesScope.length} icon={FileText} accent={INK}/><KpiCard label="Non lus" value={messagesNonLusListe.length} icon={AlertTriangle} accent={messagesNonLusListe.length?CORAL:TEAL}/><KpiCard label="Envoyés" value={messagesEnvoyes.length} icon={FileText} accent={TEAL}/></div>
              <div style={{background:CARD,border:`1px solid ${INK}12`,borderRadius:16,padding:14,marginBottom:14}}><Field label="Recherche rapide"><input style={{...inputStyle,minWidth:280,width:"100%",boxSizing:"border-box"}} placeholder="Sujet, message, statut..." value={mailSearch} onChange={e=>setMailSearch(e.target.value)}/></Field></div>
              <div>{getMessagesByBox(superMailBox).length ? getMessagesByBox(superMailBox).map(m => <MessageCard key={m.id} m={m} superView />) : <div style={{background:CARD,border:`1px dashed ${INK}22`,borderRadius:16,padding:24,color:`${INK}88`,fontWeight:800}}>Aucun message dans ce dossier.</div>}</div>
            </div>
          </div>
        </>}

        {superTab === "super_support" && <><SectionTitle title="Support & Tickets" /><form onSubmit={saveTicketSupport} style={formStyle(CARD, INK)}><Field label="Sujet"><input required style={{...inputStyle,minWidth:220}} value={ticketForm.sujet} onChange={e=>setTicketForm({...ticketForm,sujet:e.target.value})}/></Field><Field label="Priorité"><select style={inputStyle} value={ticketForm.priorite} onChange={e=>setTicketForm({...ticketForm,priorite:e.target.value})}><option value="faible">Faible</option><option value="normale">Normale</option><option value="elevee">Élevée</option></select></Field><Field label="Message"><input style={{...inputStyle,minWidth:300}} value={ticketForm.message} onChange={e=>setTicketForm({...ticketForm,message:e.target.value})}/></Field><Button type="submit">Créer ticket</Button></form><Table headers={["Date","Entreprise","Sujet","Priorité","Statut","Message","Actions"]}>{ticketsSupport.map(t=>{const e=allEntreprises.find(x=>x.id===t.entreprise_id);return <tr key={t.id} style={{borderTop:`1px solid ${INK}0D`,background:t.statut!=="ferme"?`${MUSTARD}08`:"transparent"}}><td style={cell}>{t.created_at ? new Date(t.created_at).toLocaleDateString("fr-FR") : "—"}</td><td style={cell}>{e?.nom||"—"}</td><td style={cell}>{t.sujet}</td><td style={cell}>{t.priorite}</td><td style={cell}>{t.statut}</td><td style={cell}>{t.message||"—"}</td><td style={cell}>{t.statut!=="ferme"&&<button onClick={()=>changerStatutTicket(t.id,"ferme")} style={linkBtn(TEAL)}>Fermer</button>}</td></tr>})}</Table></>}


        {superTab === "super_parametres" && <>
          <SectionTitle title="Paramètres SuperAdmin" sub="Personnalisation de l'espace propriétaire et préférences d'affichage." />
          <div style={{background:themeCard,border:`1px solid ${activeTheme.border}`,borderRadius:20,padding:20,marginBottom:18,boxShadow:"0 14px 38px rgba(15,23,42,0.07)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap",marginBottom:18}}>
              <div>
                <h3 style={{margin:"0 0 5px",color:themeText,fontSize:18}}>Thèmes premium</h3>
                <div style={{fontSize:13,color:activeTheme.muted || `${INK}88`}}>Choisissez un thème propre pour l'espace SuperAdmin. Le choix est sauvegardé sur votre profil.</div>
              </div>
              <select style={{...inputStyle,minWidth:260,borderColor:themeAccent,background:activeTheme.card,color:themeText}} value={themeKey} onChange={e=>changerTheme(e.target.value)}>
                {Object.entries(THEME_OPTIONS).map(([key,t]) => <option key={key} value={key}>{t.nom}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14}}>
              {Object.entries(THEME_OPTIONS).map(([key,t]) => {
                const selected = themeKey === key;
                return <button key={key} type="button" onClick={()=>changerTheme(key)} style={{textAlign:"left",border:`2px solid ${selected?t.accent:t.border}`,background:t.card,borderRadius:20,padding:0,cursor:"pointer",boxShadow:selected?`0 18px 40px ${t.accent}25`:"0 8px 20px rgba(15,23,42,0.06)",overflow:"hidden",transition:"all .18s ease"}}>
                  <div style={{height:76,background:`linear-gradient(135deg, ${t.sidebar} 0%, ${t.accent} 70%, ${t.secondary || t.accent} 100%)`,position:"relative"}}>
                    <div style={{position:"absolute",right:14,top:14,width:34,height:34,borderRadius:12,background:"rgba(255,255,255,.18)",border:"1px solid rgba(255,255,255,.25)"}} />
                    {selected && <div style={{position:"absolute",left:14,top:14,padding:"5px 9px",borderRadius:999,background:"rgba(255,255,255,.92)",color:t.accent,fontSize:11,fontWeight:900}}>ACTIF</div>}
                  </div>
                  <div style={{padding:16,background:t.card}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                      <div style={{fontWeight:950,color:t.text,fontSize:14}}>{t.nom}</div>
                      <div style={{display:"flex",gap:5}}>
                        {[t.accent,t.secondary,t.bg].map((c,i)=><span key={i} style={{width:17,height:17,borderRadius:999,background:c,border:`1px solid ${t.border}`,display:"inline-block"}} />)}
                      </div>
                    </div>
                    <div style={{fontSize:12,color:t.muted || "#64748B",marginTop:6,lineHeight:1.45}}>{t.description}</div>
                  </div>
                </button>;
              })}
            </div>
          </div>
        </>}

        {superTab === "super_sauvegardes" && <><SectionTitle title="Sauvegardes & Exports SaaS" sub="Historique des sauvegardes et outils d'export de la plateforme." /><div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}><KpiCard label="Sauvegardes" value={backupRows.length} icon={Save} accent={TEAL}/><KpiCard label="PME" value={allEntreprises.length} icon={Users} accent={INK}/><KpiCard label="Logs" value={logs.length} icon={Settings} accent={MUSTARD}/></div><div style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:18,display:"flex",gap:10,flexWrap:"wrap",marginBottom:18}}><Button onClick={enregistrerSauvegarde}><Save size={15}/> Export complet JSON</Button><Button secondary onClick={()=>downloadCSV("pme_clientes.csv",["PME","Code","Email","Téléphone"],allEntreprises.map(e=>[e.nom,e.code_entreprise,e.email,e.telephone]))}>Export PME CSV</Button><Button secondary onClick={()=>downloadCSV("revenus_saas.csv",["Date","Entreprise","Montant","Statut"],paiementsSaas.map(p=>{const e=allEntreprises.find(x=>x.id===p.entreprise_id);return [p.date_paiement,e?.nom||"—",p.montant,p.statut]}))}>Export revenus CSV</Button></div><Table headers={["Date","PME","Type","Statut","Détails"]}>{backupRows.map(b=>{const e=allEntreprises.find(x=>x.id===b.entreprise_id);return <tr key={b.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{b.created_at ? new Date(b.created_at).toLocaleString("fr-FR") : "—"}</td><td style={cell}>{e?.nom||"Plateforme"}</td><td style={cell}>{b.type_sauvegarde}</td><td style={cell}>{b.statut}</td><td style={cell}>{b.details||"—"}</td></tr>})}</Table></>}


        {superTab === "super_logs" && <><SectionTitle title="Logs & Audit" sub="Historique automatique des actions importantes de la plateforme avec recherche, dates et pagination." />
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}><KpiCard label="Logs affichés" value={`${logsFiltres.length} / ${logs.length}`} icon={Settings} accent={INK}/><KpiCard label="Aujourd'hui" value={logs.filter(l=>String(l.created_at||"").slice(0,10)===today()).length} icon={Calendar} accent={TEAL}/><KpiCard label="Modules" value={logModulesDisponibles.length} icon={FileText} accent={MUSTARD}/></div>
          <div style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:16,padding:16,display:"flex",gap:10,alignItems:"end",flexWrap:"wrap",marginBottom:16}}>
            <Field label="Recherche"><input style={{...inputStyle,minWidth:260}} placeholder="PME, utilisateur, module, action, détail..." value={logSearch} onChange={e=>setLogSearch(e.target.value)} /></Field>
            <Field label="Module"><select style={{...inputStyle,minWidth:180}} value={logModuleFilter} onChange={e=>setLogModuleFilter(e.target.value)}><option value="tous">Tous les modules</option>{logModulesDisponibles.map(m=><option key={m} value={m}>{m}</option>)}</select></Field>
            <Field label="Du"><input type="date" style={inputStyle} value={logDateDebut} onChange={e=>setLogDateDebut(e.target.value)} /></Field>
            <Field label="Au"><input type="date" style={inputStyle} value={logDateFin} onChange={e=>setLogDateFin(e.target.value)} /></Field>
            <Button secondary onClick={()=>{setLogSearch("");setLogModuleFilter("tous");setLogDateDebut("");setLogDateFin("");}}>Réinitialiser</Button>
            <Button secondary onClick={chargerSuperAdminData}>Rafraîchir</Button>
            <Button secondary onClick={()=>downloadCSV("logs_audit.csv",["Date","Entreprise","Utilisateur","Module","Action","Détails"],logsFiltres.map(l=>{const e=allEntreprises.find(x=>x.id===l.entreprise_id); const u=allProfils.find(x=>x.id===l.utilisateur_id); return [l.created_at ? new Date(l.created_at).toLocaleString("fr-FR") : "—", e?.nom||"—", u?.nom_complet||"—", l.module||"—", l.action||"—", l.details||"—"];}))}>Export CSV</Button>
          </div>
          <Table headers={["Date","Entreprise","Utilisateur","Module","Action","Détails"]}>{logsAffiches.map(l=>{const e=allEntreprises.find(x=>x.id===l.entreprise_id); const u=allProfils.find(x=>x.id===l.utilisateur_id);return <tr key={l.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{l.created_at ? new Date(l.created_at).toLocaleString("fr-FR") : "—"}</td><td style={cell}>{e?.nom||"—"}</td><td style={cell}>{u?.nom_complet||"—"}</td><td style={cell}><span style={{padding:"4px 8px",borderRadius:999,background:`${TEAL}12`,color:TEAL,fontWeight:900,fontSize:12}}>{l.module||"—"}</span></td><td style={cell}>{l.action||"—"}</td><td style={{...cell,maxWidth:420,whiteSpace:"normal"}}>{l.details||"—"}</td></tr>})}</Table>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",marginTop:14,background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:"10px 14px"}}>
            <div style={{fontSize:12,color:`${INK}88`,fontWeight:800}}>5 lignes par page — Page {pageLogs} / {totalPagesLogs}</div>
            <div style={{display:"flex",gap:8}}><Button secondary disabled={pageLogs<=1} onClick={()=>setPageLogs(p=>Math.max(1,p-1))}>◀ Précédent</Button><Button secondary disabled={pageLogs>=totalPagesLogs} onClick={()=>setPageLogs(p=>Math.min(totalPagesLogs,p+1))}>Suivant ▶</Button></div>
          </div>
        </>}

        {superTab === "super_crm" && <><SectionTitle title="CRM Global SaaS" sub="Prospects plateforme, campagnes marketing et relances commerciales réservés au Super Admin." /><div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}><KpiCard label="Prospects" value={prospects.length} icon={Users} accent={TEAL}/><KpiCard label="Campagnes" value={campagnes.length} icon={FileText} accent={MUSTARD}/><KpiCard label="Relances dues" value={relances.filter(r=>r.date_relance<=today()&&r.statut!=="faite").length} icon={Calendar} accent={CORAL}/><KpiCard label="Convertis" value={prospects.filter(p=>p.statut==="converti").length} icon={TrendingUp} accent={INK}/></div><SectionTitle title="Prospects plateforme" /><form onSubmit={superSaveProspect} style={formStyle(CARD, INK)}><Field label="Nom PME / Prospect"><input required style={{...inputStyle,minWidth:220}} value={superCrmProspectForm.nom} onChange={e=>setSuperCrmProspectForm({...superCrmProspectForm,nom:e.target.value})}/></Field><Field label="Téléphone"><PhoneSNInput value={superCrmProspectForm.telephone} onChange={v=>setSuperCrmProspectForm({...superCrmProspectForm,telephone:v})} style={inputStyle}/></Field><Field label="Email"><input type="email" style={{...inputStyle,minWidth:190}} value={superCrmProspectForm.email} onChange={e=>setSuperCrmProspectForm({...superCrmProspectForm,email:e.target.value})}/></Field><Field label="Source"><input style={{...inputStyle,minWidth:150}} value={superCrmProspectForm.source} onChange={e=>setSuperCrmProspectForm({...superCrmProspectForm,source:e.target.value})}/></Field><Field label="Statut"><select style={inputStyle} value={superCrmProspectForm.statut} onChange={e=>setSuperCrmProspectForm({...superCrmProspectForm,statut:e.target.value})}><option value="nouveau">Nouveau</option><option value="contacte">Contacté</option><option value="interesse">Intéressé</option><option value="converti">Converti</option><option value="perdu">Perdu</option></select></Field><Field label="Note"><input style={{...inputStyle,minWidth:220}} value={superCrmProspectForm.note} onChange={e=>setSuperCrmProspectForm({...superCrmProspectForm,note:e.target.value})}/></Field><Button type="submit"><Plus size={15}/> Ajouter prospect</Button></form><Table headers={["Prospect","Téléphone","Email","Source","Statut","Note","Actions"]}>{prospects.map(p=><tr key={p.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{p.nom}</td><td style={cell}>{p.telephone||"—"}</td><td style={cell}>{p.email||"—"}</td><td style={cell}>{p.source||"—"}</td><td style={cell}>{p.statut}</td><td style={cell}>{p.note||"—"}</td><td style={cell}>{p.telephone&&<button onClick={()=>ouvrirWhatsApp(p.telephone,`Bonjour ${p.nom}, nous vous contactons concernant Suivi PME SaaS.`)} style={linkBtn(TEAL)}>WhatsApp</button>}<button onClick={()=>deleteRow("prospects",p.id)} style={linkBtn(CORAL)}>Supprimer</button></td></tr>)}</Table><div style={{height:18}}/><SectionTitle title="Campagnes globales" /><form onSubmit={superSaveCampagne} style={formStyle(CARD, INK)}><Field label="Nom campagne"><input required style={{...inputStyle,minWidth:220}} value={superCrmCampagneForm.nom} onChange={e=>setSuperCrmCampagneForm({...superCrmCampagneForm,nom:e.target.value})}/></Field><Field label="Canal"><select style={inputStyle} value={superCrmCampagneForm.canal} onChange={e=>setSuperCrmCampagneForm({...superCrmCampagneForm,canal:e.target.value})}><option value="whatsapp">WhatsApp</option><option value="sms">SMS</option><option value="email">Email</option></select></Field><Field label="Statut"><select style={inputStyle} value={superCrmCampagneForm.statut} onChange={e=>setSuperCrmCampagneForm({...superCrmCampagneForm,statut:e.target.value})}><option value="brouillon">Brouillon</option><option value="active">Active</option><option value="terminee">Terminée</option></select></Field><Field label="Message"><input style={{...inputStyle,minWidth:330}} value={superCrmCampagneForm.message} onChange={e=>setSuperCrmCampagneForm({...superCrmCampagneForm,message:e.target.value})}/></Field><Button type="submit">Créer campagne</Button></form><Table headers={["Nom","Canal","Statut","Message","Actions"]}>{campagnes.map(c=><tr key={c.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{c.nom}</td><td style={cell}>{c.canal}</td><td style={cell}>{c.statut}</td><td style={cell}>{c.message||"—"}</td><td style={cell}><button onClick={()=>copierCampagne(c)} style={linkBtn(TEAL)}>Copier</button><button onClick={()=>deleteRow("campagnes",c.id)} style={linkBtn(CORAL)}>Supprimer</button></td></tr>)}</Table><div style={{height:18}}/><SectionTitle title="Relances commerciales" /><form onSubmit={superSaveRelance} style={formStyle(CARD, INK)}><Field label="Prospect"><select required style={{...inputStyle,minWidth:220}} value={superCrmRelanceForm.prospect_id} onChange={e=>setSuperCrmRelanceForm({...superCrmRelanceForm,prospect_id:e.target.value})}><option value="">Sélectionner</option>{prospects.map(p=><option key={p.id} value={p.id}>{p.nom}</option>)}</select></Field><Field label="Objet"><input style={{...inputStyle,minWidth:220}} value={superCrmRelanceForm.objet} onChange={e=>setSuperCrmRelanceForm({...superCrmRelanceForm,objet:e.target.value})}/></Field><Field label="Date"><input type="date" style={inputStyle} value={superCrmRelanceForm.date_relance} onChange={e=>setSuperCrmRelanceForm({...superCrmRelanceForm,date_relance:e.target.value})}/></Field><Field label="Note"><input style={{...inputStyle,minWidth:240}} value={superCrmRelanceForm.note} onChange={e=>setSuperCrmRelanceForm({...superCrmRelanceForm,note:e.target.value})}/></Field><Button type="submit">Créer relance</Button></form><Table headers={["Date","Prospect","Objet","Statut","Note","Actions"]}>{relances.map(r=>{const p=prospects.find(x=>x.id===r.prospect_id);return <tr key={r.id} style={{borderTop:`1px solid ${INK}0D`,background:r.date_relance<=today()&&r.statut!=="faite"?`${CORAL}08`:"transparent"}}><td style={cell}>{r.date_relance}</td><td style={cell}>{p?.nom||"—"}</td><td style={cell}>{r.objet||"—"}</td><td style={cell}>{r.statut}</td><td style={cell}>{r.note||"—"}</td><td style={cell}>{r.statut!=="faite"&&<button onClick={()=>marquerRelanceFaite(r.id)} style={linkBtn(TEAL)}>Faite</button>}<button onClick={()=>deleteRow("relances",r.id)} style={linkBtn(CORAL)}>Supprimer</button></td></tr>})}</Table></>}
      </main>
    </div>;
  }


  return <div className={dashboardMasque ? "dash-hidden" : ""} style={{ display: "flex", minHeight: "100vh", background: themeBg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif", color: themeText }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .kpi-card { transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease; }
        .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 18px 38px rgba(15,23,42,.11) !important; }
        .dash-hidden .kpi-card { display: none !important; }
        .dash-toggle-btn:hover { transform: translateY(-1px); box-shadow: 0 16px 30px rgba(15,23,42,.20) !important; }
        table { font-family: Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif; }
      `}</style>
      <button
        type="button"
        className="dash-toggle-btn"
        onClick={() => setDashboardMasque(v => !v)}
        style={{ position: "fixed", right: 22, bottom: 22, zIndex: 3000, display: "inline-flex", alignItems: "center", gap: 8, border: "none", borderRadius: 999, padding: "11px 15px", background: dashboardMasque ? TEAL : INK, color: "#fff", fontWeight: 900, fontSize: 12.5, cursor: "pointer", boxShadow: "0 12px 24px rgba(15,23,42,.18)" }}
        title={dashboardMasque ? "Voir les tableaux de bord" : "Masquer les tableaux de bord"}
      >
        <span style={{fontSize:15}}>{dashboardMasque ? "👁️" : "🙈"}</span>
        {dashboardMasque ? "Voir tableaux de bord" : "Masquer tableaux de bord"}
      </button>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap'); input:focus,select:focus,textarea:focus{border-color:${themeAccent}!important;box-shadow:0 0 0 3px ${themeAccent}22!important}.menu-btn{display:none}@media(max-width:760px){.sb{position:fixed;z-index:20;height:100%;transform:translateX(-100%);transition:.2s}.sb.open{transform:translateX(0)}.content{padding:18px 14px!important}.menu-btn{display:inline-flex!important;margin-bottom:12px;background:#fff;border:1px solid ${INK}22;border-radius:8px;padding:8px}}`}</style>
    <aside className={`sb${sidebarOpen ? " open" : ""}`} style={{ width: 236, background: INK, padding: "22px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", gap: 10, padding: "0 8px 22px", alignItems: "center" }}><div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg,${TEAL},${MUSTARD})` }} /><div><div style={{ color: "#fff", fontFamily: "Sora", fontWeight: 800 }}>Suivi</div><div style={{ color: MUSTARD, fontFamily: "Sora", fontWeight: 800 }}>PME</div></div></div>
      {nav.map(([key, label, Icon]) => <NavItem key={key} icon={Icon} label={label} active={tab === key} onClick={() => { setTab(key); setSidebarOpen(false); }} />)}
      <div style={{ marginTop: "auto", padding: "12px 8px 0", borderTop: "1px solid #ffffff1a" }}>
      {entreprise && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: "#ffffffcc", fontWeight: 600 }}>
            {entreprise.nom}
          </div>
          <div style={{ fontSize: 10.5, color: "#ffffff88", marginTop: 3 }}>Poste : {posteAffiche}</div>

          <div
            onClick={() => navigator.clipboard?.writeText(entreprise.code_invitation)}
            style={{
              fontSize: 10.5,
              color: "#ffffff88",
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              gap: 5,
              cursor: "pointer"
            }}
            title="Copier le code d'invitation"
          >
            Code d'invitation : {entreprise.code_invitation}
            <Copy size={11} />
          </div>
        </div>
      )}

      {isSuperAdmin && <button onClick={() => setSuperAdminMode(true)} style={{ display:"flex",alignItems:"center",gap:6,background:MUSTARD,border:"none",borderRadius:8,color:INK,fontSize:11.5,fontWeight:800,marginTop:10,cursor:"pointer",padding:"8px 10px" }}>Mode Super Admin</button>}

      <button
        onClick={() => supabase.auth.signOut()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          color: "#ffffff88",
          fontSize: 11.5,
          marginTop: 10,
          cursor: "pointer",
          padding: 0
        }}
      >
        <LogOut size={13} /> Déconnexion
      </button>
    </div>
    </aside>
    <main className="content" style={{ flex: 1, padding: "28px 38px", maxWidth: 1280 }}>
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="menu-btn">{sidebarOpen ? <X size={20} /> : <Menu size={20} />}</button>
      {message && <div style={{ background: message.includes("enregistr") ? `${TEAL}12` : `${CORAL}12`, color: message.includes("enregistr") ? TEAL : CORAL, border: `1px solid ${INK}15`, padding: "10px 14px", borderRadius: 9, marginBottom: 14, fontSize: 13 }}>{message}</div>}
      {loading ? <div>Chargement des données…</div> : <>

        {messageModal.open && <div style={{position:"fixed",inset:0,background:"rgba(21,34,56,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:20}}>
          <div style={{background:"#fff",borderRadius:18,padding:26,maxWidth:430,width:"100%",boxShadow:"0 30px 90px rgba(21,34,56,0.28)",border:`1px solid ${INK}14`,textAlign:"center"}}>
            <div style={{fontSize:38,marginBottom:10}}>✅</div>
            <h2 style={{margin:"0 0 8px",fontFamily:"Sora, sans-serif",color:INK}}>{messageModal.title}</h2>
            <p style={{color:`${INK}AA`,fontSize:14,lineHeight:1.5}}>{messageModal.message}</p>
            <Button onClick={()=>setMessageModal({open:false,title:"",message:""})}>OK</Button>
          </div>
        </div>}

        {tab === "dashboard" && <><SectionTitle title={`Tableau de bord — ${entreprise?.nom || "Entreprise"}`} /><div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 22 }}><KpiCard label="CA du mois" value={fmt(ca)} icon={TrendingUp} accent={TEAL} sub={`${ventes.length} vente(s)`} /><KpiCard label="Achats du mois" value={fmt(achatsTotal)} icon={Truck} accent={INK} sub={`${achats.length} achat(s)`} /><KpiCard label="Dépenses" value={fmt(depTotal)} icon={Wallet} accent={MUSTARD} /><KpiCard label="Marge nette" value={fmt(marge)} icon={TrendingUp} accent={marge >= 0 ? TEAL : CORAL} /><KpiCard label="Valeur stock" value={fmt(valeurStock)} icon={Package} accent={INK} /><KpiCard label="Résultat jour" value={fmt(resultatJournalier)} icon={TrendingUp} accent={resultatJournalier>=0?TEAL:CORAL} /><KpiCard label="Résultat semaine" value={fmt(resultatHebdo)} icon={TrendingUp} accent={resultatHebdo>=0?TEAL:CORAL} /><KpiCard label="Résultat année" value={fmt(resultatAnnuel)} icon={TrendingUp} accent={resultatAnnuel>=0?TEAL:CORAL} /><KpiCard label="Solde caisses" value={fmt(soldeCaisses)} icon={DollarSign} accent={TEAL} /><KpiCard label="Solde banques" value={fmt(soldeBanques)} icon={CreditCard} accent={INK} /><KpiCard label="Créances" value={fmt(totalCreances)} icon={FileText} accent={MUSTARD} /><KpiCard label="Dettes" value={fmt(totalDettes)} icon={Wallet} accent={CORAL} /></div>{produitsAlerte.length > 0 && <div style={{ background: `${CORAL}12`, border: `1px solid ${CORAL}44`, borderRadius: 10, padding: 12, marginBottom: 18 }}><AlertTriangle size={16} color={CORAL} /> <b>{produitsAlerte.length} produit(s)</b> en stock bas : {produitsAlerte.map(p => p.nom).join(", ")}</div>}<div style={{ background: CARD, borderRadius: 12, padding: 16, border: `1px solid ${INK}0F`, marginBottom: 22 }}><SectionTitle title="Dashboard financier" sub="Résultat journalier, hebdomadaire, mensuel et annuel." /><Table headers={["Période","Chiffre d'affaires","Achats","Dépenses","Résultat"]}>{resumeFinancier.map((r)=><tr key={r.label} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{r.label}</td><td style={{...cell,color:TEAL,fontWeight:800}}>{fmt(r.ventes)}</td><td style={cell}>{fmt(r.achats)}</td><td style={cell}>{fmt(r.depenses)}</td><td style={{...cell,color:r.resultat>=0?TEAL:CORAL,fontWeight:900}}>{fmt(r.resultat)}</td></tr>)}</Table></div><div style={{ background: CARD, borderRadius: 12, padding: 16, border: `1px solid ${INK}0F`, marginBottom: 24 }}><ResponsiveContainer width="100%" height={240}><ComposedChart data={chartData}><CartesianGrid stroke={LINE} vertical={false} /><XAxis dataKey="mois" /><YAxis tickFormatter={(v) => `${v / 1000}k`} /><Tooltip formatter={(v) => fmt(v)} /><Bar dataKey="ca" name="Chiffre d'affaires" fill={TEAL} /><Bar dataKey="achats" name="Achats" fill={INK} /><Bar dataKey="depenses" name="Dépenses" fill={CORAL} /></ComposedChart></ResponsiveContainer></div>{depensesParCategorie.length > 0 && <div style={{ background: CARD, borderRadius: 12, padding: 16, border: `1px solid ${INK}0F` }}><SectionTitle title="Répartition des dépenses" /><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={depensesParCategorie} dataKey="valeur" nameKey="categorie" innerRadius={55} outerRadius={90}>{depensesParCategorie.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}</Pie><Tooltip formatter={(v) => fmt(v)} /></PieChart></ResponsiveContainer></div>}</>}

        {tab === "clients" && <><SectionTitle title="Clients" sub="Ajoutez vos clients pour les lier aux ventes et factures." /><form onSubmit={(e) => { e.preventDefault(); savePerson("clients", clientForm, setClientForm, emptyPerson); }} style={formStyle(CARD, INK)}>{personInputs(clientForm, setClientForm, inputStyle)}<Button type="submit"><Plus size={15}/> {clientForm.id ? "Modifier" : "Ajouter"}</Button>{clientForm.id && <Button secondary onClick={() => setClientForm(emptyPerson)}>Annuler</Button>}</form><div style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:14,marginBottom:12,display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}><Field label="Recherche"><input style={{...inputStyle,minWidth:260}} placeholder="Nom, téléphone, email, adresse..." value={clientsSearch} onChange={e=>{setClientsSearch(e.target.value);setClientsPage(1);}}/></Field><div style={{marginLeft:"auto",fontSize:12.5,color:`${INK}88`,fontWeight:800}}>{clientsFiltresPro.length} client(s) — 5 lignes par page</div></div>{renderPeopleTable(clientsPageRows, setClientForm, (id) => deleteRow("clients", id), cell)}<PaginationPro page={clientsPage} pages={pagesClients} setPage={setClientsPage} /></>}
        {tab === "fournisseurs" && <><SectionTitle title="Fournisseurs" sub="Suivez vos fournisseurs et rattachez-les aux achats." /><form onSubmit={(e) => { e.preventDefault(); savePerson("fournisseurs", fournisseurForm, setFournisseurForm, emptyPerson); }} style={formStyle(CARD, INK)}>{personInputs(fournisseurForm, setFournisseurForm, inputStyle)}<Button type="submit"><Plus size={15}/> {fournisseurForm.id ? "Modifier" : "Ajouter"}</Button>{fournisseurForm.id && <Button secondary onClick={() => setFournisseurForm(emptyPerson)}>Annuler</Button>}</form><div style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:14,marginBottom:12,display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}><Field label="Recherche"><input style={{...inputStyle,minWidth:260}} placeholder="Nom, téléphone, email, adresse..." value={fournisseursSearch} onChange={e=>{setFournisseursSearch(e.target.value);setFournisseursPage(1);}}/></Field><div style={{marginLeft:"auto",fontSize:12.5,color:`${INK}88`,fontWeight:800}}>{fournisseursFiltresPro.length} fournisseur(s) — 5 lignes par page</div></div>{renderPeopleTable(fournisseursPageRows, setFournisseurForm, (id) => deleteRow("fournisseurs", id), cell)}<PaginationPro page={fournisseursPage} pages={pagesFournisseurs} setPage={setFournisseursPage} /></>}

        {tab === "stocks" && <><SectionTitle title="Produits / Stock avancé & Inventaire" sub="Produits, catégories, mouvements, inventaires et alertes de stock." /><div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:18 }}><KpiCard label="Valeur stock achat" value={fmt(valeurStock)} icon={Package} accent={INK} /><KpiCard label="Valeur stock vente" value={fmt(valeurVenteStock)} icon={TrendingUp} accent={TEAL} /><KpiCard label="Stock bas" value={produitsAlerte.length} icon={AlertTriangle} accent={MUSTARD} /><KpiCard label="Ruptures" value={produitsRupture.length} icon={AlertTriangle} accent={CORAL} /></div><form onSubmit={saveCategorie} style={formStyle(CARD, INK)}><Field label="Catégorie"><input required placeholder="Ex : Alimentaire, Téléphonie..." style={{...inputStyle,minWidth:220}} value={categorieForm.nom} onChange={e=>setCategorieForm({...categorieForm,nom:e.target.value})}/></Field><Button type="submit"><Plus size={15}/> {categorieForm.id ? "Modifier catégorie" : "Ajouter catégorie"}</Button>{categorieForm.id && <Button secondary onClick={()=>setCategorieForm({id:null,nom:""})}>Annuler</Button>}</form><Table headers={["Catégorie","Actions"]}>{categories.map(c=><tr key={c.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{c.nom}</td><td style={cell}><button onClick={()=>setCategorieForm(c)} style={linkBtn(TEAL)}>Modifier</button><button onClick={()=>deleteRow("categories",c.id)} style={linkBtn(CORAL)}>Supprimer</button></td></tr>)}</Table><div style={{height:18}}/><form onSubmit={saveProduit} style={formStyle(CARD, INK)}><Field label="Nom produit"><input required style={{...inputStyle,minWidth:190}} value={produitForm.nom} onChange={e=>setProduitForm({...produitForm,nom:e.target.value})}/></Field><Field label="Catégorie"><select style={{...inputStyle,minWidth:170}} value={produitForm.categorie_id||""} onChange={e=>setProduitForm({...produitForm,categorie_id:e.target.value})}><option value="">Non classé</option>{categories.map(c=><option key={c.id} value={c.id}>{c.nom}</option>)}</select></Field><Field label="Code-barres"><input style={{...inputStyle,minWidth:150}} value={produitForm.code_barres||""} onChange={e=>setProduitForm({...produitForm,code_barres:e.target.value})}/></Field><Field label="Image URL"><input style={{...inputStyle,minWidth:180}} value={produitForm.image_url||""} onChange={e=>setProduitForm({...produitForm,image_url:e.target.value})}/></Field><Field label="Quantité"><input type="number" min="0" style={{...inputStyle,width:105}} value={produitForm.quantite} onChange={e=>setProduitForm({...produitForm,quantite:e.target.value})}/></Field><Field label="Seuil"><input type="number" min="0" style={{...inputStyle,width:105}} value={produitForm.seuil_alerte} onChange={e=>setProduitForm({...produitForm,seuil_alerte:e.target.value})}/></Field><Field label="Prix achat"><input type="number" min="0" style={{...inputStyle,width:115}} value={produitForm.prix_achat} onChange={e=>setProduitForm({...produitForm,prix_achat:e.target.value})}/></Field><Field label="Prix vente"><input type="number" min="0" style={{...inputStyle,width:115}} value={produitForm.prix_vente} onChange={e=>setProduitForm({...produitForm,prix_vente:e.target.value})}/></Field><Button type="submit"><Plus size={15}/> {produitForm.id ? "Modifier" : "Ajouter"}</Button>{produitForm.id && <Button secondary onClick={()=>setProduitForm(emptyProduit)}>Annuler</Button>}</form><SectionTitle title="Inventaire physique" sub="Corrigez le stock réel après comptage." /><form onSubmit={saveInventaire} style={formStyle(CARD, INK)}><Field label="Produit"><select required style={{...inputStyle,minWidth:220}} value={inventaireForm.produit_id} onChange={e=>setInventaireForm({...inventaireForm,produit_id:e.target.value})}>{produits.map(p=><option key={p.id} value={p.id}>{p.nom} — Stock système: {p.quantite}</option>)}</select></Field><Field label="Stock physique"><input type="number" min="0" required style={{...inputStyle,width:140}} value={inventaireForm.stock_physique} onChange={e=>setInventaireForm({...inventaireForm,stock_physique:e.target.value})}/></Field><Button type="submit"><Save size={15}/> Valider inventaire</Button></form><SectionTitle title="Mouvement de stock" sub="Entrée, sortie, ajustement, retour client ou retour fournisseur." /><form onSubmit={saveMouvementStock} style={formStyle(CARD, INK)}><Field label="Produit"><select required style={{...inputStyle,minWidth:220}} value={mouvementStockForm.produit_id} onChange={e=>setMouvementStockForm({...mouvementStockForm,produit_id:e.target.value})}>{produits.map(p=><option key={p.id} value={p.id}>{p.nom} — Stock: {p.quantite}</option>)}</select></Field><Field label="Type"><select style={inputStyle} value={mouvementStockForm.type_mouvement} onChange={e=>setMouvementStockForm({...mouvementStockForm,type_mouvement:e.target.value})}><option value="entree">Entrée</option><option value="sortie">Sortie</option><option value="ajustement">Ajustement stock final</option><option value="retour_client">Retour client</option><option value="retour_fournisseur">Retour fournisseur</option></select></Field><Field label="Quantité"><input type="number" min="0" required style={{...inputStyle,width:120}} value={mouvementStockForm.quantite} onChange={e=>setMouvementStockForm({...mouvementStockForm,quantite:e.target.value})}/></Field><Field label="Motif"><input style={{...inputStyle,minWidth:240}} value={mouvementStockForm.motif} onChange={e=>setMouvementStockForm({...mouvementStockForm,motif:e.target.value})}/></Field><Button type="submit"><Plus size={15}/> Enregistrer mouvement</Button></form><Table headers={["Image","Code","Produit","Catégorie","Qté","Seuil","Prix achat","Prix vente","Valeur","Statut","Actions"]}>{produits.map(p=>{const bas=Number(p.quantite)<=Number(p.seuil_alerte); const cat=categories.find(c=>c.id===p.categorie_id);return <tr key={p.id} style={{borderTop:`1px solid ${INK}0D`,background:bas?`${CORAL}08`:"transparent"}}><td style={cell}>{p.image_url?<img src={p.image_url} alt={p.nom} style={{width:38,height:38,objectFit:"cover",borderRadius:7}}/>:"—"}</td><td style={cell}>{p.code_produit || codeCourt("PRD",p.id)}</td><td style={cell}>{p.nom}</td><td style={cell}>{cat?.nom || "Non classé"}</td><td style={cell}>{p.quantite}</td><td style={cell}>{p.seuil_alerte}</td><td style={cell}>{fmt(p.prix_achat)}</td><td style={cell}>{fmt(p.prix_vente)}</td><td style={cell}>{fmt(Number(p.quantite)*Number(p.prix_achat))}</td><td style={cell}>{bas?<span style={{color:CORAL,fontWeight:800}}>Stock bas</span>:<span style={{color:TEAL,fontWeight:800}}>OK</span>}</td><td style={cell}><button onClick={()=>setProduitForm({...p,quantite:String(p.quantite),seuil_alerte:String(p.seuil_alerte),prix_achat:String(p.prix_achat),prix_vente:String(p.prix_vente),categorie_id:p.categorie_id||"",code_barres:p.code_barres||"",image_url:p.image_url||""})} style={linkBtn(TEAL)}>Modifier</button><button onClick={()=>deleteRow("produits",p.id)} style={linkBtn(CORAL)}>Supprimer</button></td></tr>})}</Table><div style={{height:18}}/><SectionTitle title="Historique des mouvements" /><Table headers={["Date","Produit","Type","Qté","Avant","Après","Motif"]}>{mouvementsStock.slice(0,80).map(m=>{const p=produits.find(x=>x.id===m.produit_id);return <tr key={m.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{m.created_at ? new Date(m.created_at).toLocaleDateString("fr-FR") : "—"}</td><td style={cell}>{p?.nom||"—"}</td><td style={cell}>{m.type_mouvement}</td><td style={cell}>{m.quantite}</td><td style={cell}>{m.stock_avant}</td><td style={cell}>{m.stock_apres}</td><td style={cell}>{m.motif||"—"}</td></tr>})}</Table><div style={{height:18}}/><SectionTitle title="Historique inventaires" /><Table headers={["Date","Produit","Stock système","Stock physique","Écart"]}>{inventaires.slice(0,80).map(inv=>{const p=produits.find(x=>x.id===inv.produit_id);return <tr key={inv.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{inv.created_at ? new Date(inv.created_at).toLocaleDateString("fr-FR") : "—"}</td><td style={cell}>{p?.nom||"—"}</td><td style={cell}>{inv.stock_systeme}</td><td style={cell}>{inv.stock_physique}</td><td style={{...cell,color:Number(inv.ecart)===0?TEAL:CORAL,fontWeight:800}}>{inv.ecart}</td></tr>})}</Table></>}

        {tab === "ventes" && <><SectionTitle title="Ventes professionnelles" sub="Vente comptant, vente à crédit, paiement partiel et créance automatique." /><form onSubmit={saveVente} style={formStyle(CARD, INK)}><Field label="Client"><select required style={{...inputStyle,minWidth:220}} value={venteForm.client_id} onChange={e=>setVenteForm({...venteForm,client_id:e.target.value})}><option value="">Sélectionner un client</option>{clients.map(c=><option key={c.id} value={c.id}>{c.nom}</option>)}</select></Field><Field label="Type de vente"><select style={{...inputStyle,minWidth:150}} value={venteForm.type_vente || "comptant"} onChange={e=>setVenteForm({...venteForm,type_vente:e.target.value})}><option value="comptant">Comptant</option><option value="credit">À crédit</option></select></Field><Field label="Mode de paiement"><PaymentSelect style={inputStyle} value={venteForm.mode_paiement || "Espèces"} onChange={m=>setVenteForm({...venteForm,mode_paiement:m})} includeCredit={venteForm.type_vente==="credit"} /></Field>{venteForm.type_vente==="credit" && <><Field label="Montant payé"><input type="number" min="0" style={{...inputStyle,width:130}} value={venteForm.montant_paye} onChange={e=>setVenteForm({...venteForm,montant_paye:e.target.value})}/></Field><Field label="Échéance"><input type="date" style={inputStyle} value={venteForm.date_echeance} onChange={e=>setVenteForm({...venteForm,date_echeance:e.target.value})}/></Field></>}<div style={{ flexBasis:"100%" }}></div>{venteLignes.map((ligne, idx)=>{const p=produits.find(x=>x.id===ligne.produit_id); const total=Number(ligne.quantite||0)*Number(p?.prix_vente||0); const stockOk = !p || Number(ligne.quantite||0) <= Number(p.quantite); return <div key={idx} style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"flex-end", padding:10, border:`1px solid ${stockOk ? INK+"12" : CORAL+"66"}`, borderRadius:10, background: stockOk ? "#fff" : `${CORAL}08` }}><Field label={`Produit ${idx+1}`}><select style={{...inputStyle,minWidth:220}} value={ligne.produit_id} onChange={e=>setVenteLignes(venteLignes.map((l,i)=>i===idx?{...l,produit_id:e.target.value}:l))}>{produits.map(p=><option key={p.id} value={p.id}>{p.nom} — Stock: {p.quantite} — {fmt(p.prix_vente)}</option>)}</select></Field><Field label="Quantité"><input type="number" min="1" style={{...inputStyle,width:90}} value={ligne.quantite} onChange={e=>setVenteLignes(venteLignes.map((l,i)=>i===idx?{...l,quantite:e.target.value}:l))}/></Field><Field label="Total"><div style={{...inputStyle, minWidth:130, background:`${TEAL}08`, fontWeight:800, color:TEAL}}>{fmt(total)}</div></Field>{!stockOk && <div style={{color:CORAL,fontSize:12,fontWeight:800}}>Stock insuffisant</div>}{venteLignes.length>1 && <Button type="button" danger onClick={()=>setVenteLignes(venteLignes.filter((_,i)=>i!==idx))}>Retirer</Button>}</div>})}<div style={{ flexBasis:"100%", display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}><Button type="button" secondary onClick={()=>setVenteLignes([...venteLignes,{produit_id:produits[0]?.id||"",quantite:1}])}><Plus size={15}/> Ajouter un produit</Button><div style={{fontWeight:800,color:INK}}>Total vente : {fmt(venteLignes.reduce((s,l)=>{const p=produits.find(x=>x.id===l.produit_id);return s+Number(l.quantite||0)*Number(p?.prix_vente||0)},0))}</div></div><Button type="submit" disabled={!produits.length || !clients.length}><Plus size={15}/> Enregistrer la vente</Button></form><div style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:14,marginBottom:12,display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}><Field label="Recherche"><input style={{...inputStyle,minWidth:260}} placeholder="Client, produit, référence, montant..." value={ventesSearch} onChange={e=>{setVentesSearch(e.target.value);setVentesPage(1);}}/></Field><Field label="Du"><input type="date" style={inputStyle} value={ventesDateDebut} onChange={e=>{setVentesDateDebut(e.target.value);setVentesPage(1);}}/></Field><Field label="Au"><input type="date" style={inputStyle} value={ventesDateFin} onChange={e=>{setVentesDateFin(e.target.value);setVentesPage(1);}}/></Field><Field label="Mode paiement"><select style={inputStyle} value={ventesModeFilter} onChange={e=>{setVentesModeFilter(e.target.value);setVentesPage(1);}}><option value="tous">Tous</option>{modePaiementOptionsPro.map(m=><option key={m} value={m}>{m}</option>)}</select></Field><Field label="Statut"><select style={inputStyle} value={ventesStatutFilter} onChange={e=>{setVentesStatutFilter(e.target.value);setVentesPage(1);}}><option value="tous">Tous</option><option value="validée">Validée</option><option value="payée">Payée</option><option value="brouillon">Brouillon</option><option value="annulée">Annulée</option></select></Field><div style={{marginLeft:"auto",fontSize:12.5,color:`${INK}88`,fontWeight:800}}>{ventesFiltreesPro.length} vente(s) — 5 lignes par page</div></div>{renderVentesTable(ventesPageRows, produits, clients, cell, deleteRow, imprimerFacture)}<PaginationPro page={ventesPage} pages={pagesVentes} setPage={setVentesPage} /> </>}
        {tab === "factures" && <><SectionTitle title="Factures professionnelles & Paiements" sub="Suivi des paiements, ventes à crédit et reste à payer." />{factureEditForm && <form onSubmit={modifierFacture} style={formStyle(CARD, INK)}><Field label="Client"><select style={{...inputStyle,minWidth:190}} value={factureEditForm.client_id || ""} onChange={e=>setFactureEditForm({...factureEditForm,client_id:e.target.value})}><option value="">Client non renseigné</option>{clients.map(c=><option key={c.id} value={c.id}>{codeClient(c)} — {c.nom}</option>)}</select></Field><Field label="Produit"><select style={{...inputStyle,minWidth:220}} value={factureEditForm.produit_id} onChange={e=>{const p=produits.find(x=>x.id===e.target.value);setFactureEditForm({...factureEditForm,produit_id:e.target.value,prix_unitaire:p?.prix_vente||factureEditForm.prix_unitaire})}}>{produits.map(p=><option key={p.id} value={p.id}>{p.nom}</option>)}</select></Field><Field label="Quantité"><input type="number" min="1" style={{...inputStyle,width:90}} value={factureEditForm.quantite} onChange={e=>setFactureEditForm({...factureEditForm,quantite:e.target.value})}/></Field><Field label="Prix unitaire"><input type="number" min="0" style={{...inputStyle,width:130}} value={factureEditForm.prix_unitaire} onChange={e=>setFactureEditForm({...factureEditForm,prix_unitaire:e.target.value})}/></Field><Field label="Statut"><select style={inputStyle} value={factureEditForm.statut || "brouillon"} onChange={e=>setFactureEditForm({...factureEditForm,statut:e.target.value})}><option value="brouillon">Brouillon</option><option value="validée">Validée</option><option value="payée">Payée</option><option value="annulée">Annulée</option></select></Field><Field label="Paiement"><PaymentSelect style={inputStyle} value={factureEditForm.mode_paiement || "Espèces"} onChange={m=>setFactureEditForm({...factureEditForm,mode_paiement:m})} includeCredit /></Field><Button type="submit"><Save size={15}/> Enregistrer</Button><Button type="button" secondary onClick={()=>setFactureEditForm(null)}>Annuler</Button></form>}<div style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:14,marginBottom:12,display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}><Field label="Recherche"><input style={{...inputStyle,minWidth:260}} placeholder="Client, produit, référence, montant..." value={facturesSearch} onChange={e=>{setFacturesSearch(e.target.value);setFacturesPage(1);}}/></Field><Field label="Du"><input type="date" style={inputStyle} value={facturesDateDebut} onChange={e=>{setFacturesDateDebut(e.target.value);setFacturesPage(1);}}/></Field><Field label="Au"><input type="date" style={inputStyle} value={facturesDateFin} onChange={e=>{setFacturesDateFin(e.target.value);setFacturesPage(1);}}/></Field><Field label="Mode paiement"><select style={inputStyle} value={facturesModeFilter} onChange={e=>{setFacturesModeFilter(e.target.value);setFacturesPage(1);}}><option value="tous">Tous</option>{modePaiementOptionsPro.map(m=><option key={m} value={m}>{m}</option>)}</select></Field><Field label="Statut"><select style={inputStyle} value={facturesStatutFilter} onChange={e=>{setFacturesStatutFilter(e.target.value);setFacturesPage(1);}}><option value="tous">Tous</option><option value="validée">Validée</option><option value="payée">Payée</option><option value="brouillon">Brouillon</option><option value="annulée">Annulée</option></select></Field><div style={{marginLeft:"auto",fontSize:12.5,color:`${INK}88`,fontWeight:800}}>{facturesFiltreesPro.length} facture(s) — utilisez Suivant pour voir les autres pages</div></div>{renderVentesTable(facturesPageRows, produits, clients, cell, deleteRow, imprimerFacture, true)}<PaginationPro page={facturesPage} pages={pagesFactures} setPage={setFacturesPage} /></>}
        {tab === "devis" && <><SectionTitle title="Devis" sub="Créez un devis client avec plusieurs produits." /><form onSubmit={saveDevis} style={formStyle(CARD, INK)}><Field label="Client"><select required style={{...inputStyle,minWidth:220}} value={devisForm.client_id} onChange={e=>setDevisForm({...devisForm,client_id:e.target.value})}><option value="">Sélectionner un client</option>{clients.map(c=><option key={c.id} value={c.id}>{codeClient(c)} — {c.nom}</option>)}</select></Field><div style={{ flexBasis:"100%" }}></div>{devisLignes.map((ligne, idx)=>{const p=produits.find(x=>x.id===ligne.produit_id); const total=Number(ligne.quantite||0)*Number(p?.prix_vente||0); return <div key={idx} style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"flex-end", padding:10, border:`1px solid ${INK}12`, borderRadius:10, background:"#fff" }}><Field label={`Produit ${idx+1}`}><select style={{...inputStyle,minWidth:220}} value={ligne.produit_id} onChange={e=>setDevisLignes(devisLignes.map((l,i)=>i===idx?{...l,produit_id:e.target.value}:l))}>{produits.map(p=><option key={p.id} value={p.id}>{p.nom} — {fmt(p.prix_vente)}</option>)}</select></Field><Field label="Quantité"><input type="number" min="1" style={{...inputStyle,width:90}} value={ligne.quantite} onChange={e=>setDevisLignes(devisLignes.map((l,i)=>i===idx?{...l,quantite:e.target.value}:l))}/></Field><Field label="Total"><div style={{...inputStyle, minWidth:130, background:`${TEAL}08`, fontWeight:800, color:TEAL}}>{fmt(total)}</div></Field>{devisLignes.length>1 && <Button type="button" danger onClick={()=>setDevisLignes(devisLignes.filter((_,i)=>i!==idx))}>Retirer</Button>}</div>})}<div style={{ flexBasis:"100%", display:"flex", gap:10, alignItems:"center" }}><Button type="button" secondary onClick={()=>setDevisLignes([...devisLignes,{produit_id:produits[0]?.id||"",quantite:1}])}><Plus size={15}/> Ajouter un produit</Button><div style={{fontWeight:800,color:INK}}>Total devis : {fmt(devisLignes.reduce((s,l)=>{const p=produits.find(x=>x.id===l.produit_id);return s+Number(l.quantite||0)*Number(p?.prix_vente||0)},0))}</div></div><Button type="submit" disabled={!produits.length || !clients.length}><Plus size={15}/> Créer le devis</Button></form><Table headers={["Date","Référence","Client","Statut","Total","Actions"]}>{devis.map(d=>{const c=clients.find(x=>x.id===d.client_id);return <tr key={d.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{d.date_devis}</td><td style={cell}>{d.reference}</td><td style={cell}>{c?.nom||"—"}</td><td style={cell}>{d.statut}</td><td style={{...cell,color:TEAL,fontWeight:800}}>{fmt(d.montant_total)}</td><td style={cell}><button onClick={()=>imprimerDocumentSimple("DEVIS", d.reference, c?.nom, d.montant_total, d.date_devis)} style={linkBtn(TEAL)}>Imprimer</button>{d.statut !== "converti" && <button onClick={()=>convertirDevisEnFacture(d)} style={linkBtn(INK)}>Convertir</button>}<button onClick={()=>deleteRow("devis",d.id)} style={linkBtn(CORAL)}>Supprimer</button></td></tr>})}</Table></>}

        {tab === "depenses" && <><SectionTitle title="Dépenses" /><form onSubmit={saveDepense} style={formStyle(CARD, INK)}><Field label="Catégorie"><select style={{...inputStyle,minWidth:170}} value={depenseForm.categorie} onChange={e=>setDepenseForm({...depenseForm,categorie:e.target.value})}>{CATEGORIES_DEPENSES.map(c=><option key={c} value={c}>{c}</option>)}</select></Field><Field label="Montant"><input type="number" min="1" style={{...inputStyle,width:120}} value={depenseForm.montant} onChange={e=>setDepenseForm({...depenseForm,montant:e.target.value})}/></Field><Field label="Description"><input style={{...inputStyle,minWidth:220}} value={depenseForm.description} onChange={e=>setDepenseForm({...depenseForm,description:e.target.value})}/></Field><Button type="submit"><Plus size={15}/> Enregistrer</Button></form><div style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:14,marginBottom:12,display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}><Field label="Recherche"><input style={{...inputStyle,minWidth:260}} placeholder="Catégorie, référence, description, montant..." value={depensesSearch} onChange={e=>{setDepensesSearch(e.target.value);setDepensesPage(1);}}/></Field><Field label="Du"><input type="date" style={inputStyle} value={depensesDateDebut} onChange={e=>{setDepensesDateDebut(e.target.value);setDepensesPage(1);}}/></Field><Field label="Au"><input type="date" style={inputStyle} value={depensesDateFin} onChange={e=>{setDepensesDateFin(e.target.value);setDepensesPage(1);}}/></Field><Field label="Mode paiement"><select style={inputStyle} value={depensesModeFilter} onChange={e=>{setDepensesModeFilter(e.target.value);setDepensesPage(1);}}><option value="tous">Tous</option>{modePaiementOptionsPro.map(m=><option key={m} value={m}>{m}</option>)}</select></Field><Field label="Catégorie"><select style={inputStyle} value={depensesCategorieFilter} onChange={e=>{setDepensesCategorieFilter(e.target.value);setDepensesPage(1);}}><option value="toutes">Toutes</option>{CATEGORIES_DEPENSES.map(c=><option key={c} value={c}>{c}</option>)}</select></Field><div style={{marginLeft:"auto",fontSize:12.5,color:`${INK}88`,fontWeight:800}}>{depensesFiltreesPro.length} dépense(s) — 5 lignes par page</div></div><Table headers={["Date","Catégorie","Mode","Description","Montant",""]}>{depensesPageRows.map(d=><tr key={d.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{d.date_depense}</td><td style={cell}>{d.categorie}</td><td style={cell}><PaymentBadge mode={d.mode_paiement || "Espèces"} /></td><td style={cell}>{d.description||"—"}</td><td style={cell}>{fmt(d.montant)}</td><td style={cell}><button onClick={()=>deleteRow("depenses",d.id)} style={linkBtn(CORAL)}>Supprimer</button></td></tr>)}</Table><PaginationPro page={depensesPage} pages={pagesDepenses} setPage={setDepensesPage} /></>}
        
        {tab === "achats" && <><SectionTitle title="Achats / Approvisionnement" sub="Achetez des produits existants ou créez de nouveaux produits directement depuis l'achat." /><form onSubmit={saveAchat} style={formStyle(CARD, INK)}><Field label="Fournisseur"><select required style={{...inputStyle,minWidth:240}} value={achatForm.fournisseur_id} onChange={e=>setAchatForm({...achatForm,fournisseur_id:e.target.value})}><option value="">Sélectionner un fournisseur</option>{fournisseurs.map(f=><option key={f.id} value={f.id}>{codeFournisseur(f)} — {f.nom}</option>)}</select></Field><div style={{flexBasis:"100%"}}></div>{achatsLignes.map((ligne, idx)=>{const p=produits.find(x=>x.id===ligne.produit_id); const prix=Number(ligne.prix_unitaire || p?.prix_achat || 0); const total=Number(ligne.quantite||0)*prix; return <div key={idx} style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end",padding:12,border:`1px solid ${INK}12`,borderRadius:10,background:"#fff"}}><Field label="Type"><select style={inputStyle} value={ligne.mode || "existant"} onChange={e=>setAchatsLignes(achatsLignes.map((l,i)=>i===idx?{...l,mode:e.target.value}:l))}><option value="existant">Produit existant</option><option value="nouveau">Nouveau produit</option></select></Field>{(ligne.mode || "existant")==="existant" ? <Field label={`Produit ${idx+1}`}><select required style={{...inputStyle,minWidth:230}} value={ligne.produit_id} onChange={e=>setAchatsLignes(achatsLignes.map((l,i)=>i===idx?{...l,produit_id:e.target.value,prix_unitaire:l.prix_unitaire||produits.find(p=>p.id===e.target.value)?.prix_achat||""}:l))}>{produits.map(p=><option key={p.id} value={p.id}>{p.nom} — Stock: {p.quantite}</option>)}</select></Field> : <><Field label="Nom nouveau produit"><input required style={{...inputStyle,minWidth:220}} placeholder="Ex: Huile 20L" value={ligne.nom||""} onChange={e=>setAchatsLignes(achatsLignes.map((l,i)=>i===idx?{...l,nom:e.target.value}:l))}/></Field><Field label="Catégorie"><select style={{...inputStyle,minWidth:160}} value={ligne.categorie_id||""} onChange={e=>setAchatsLignes(achatsLignes.map((l,i)=>i===idx?{...l,categorie_id:e.target.value}:l))}><option value="">Non classé</option>{categories.map(c=><option key={c.id} value={c.id}>{c.nom}</option>)}</select></Field><Field label="Prix vente"><input type="number" min="0" style={{...inputStyle,width:120}} value={ligne.prix_vente||""} onChange={e=>setAchatsLignes(achatsLignes.map((l,i)=>i===idx?{...l,prix_vente:e.target.value}:l))}/></Field><Field label="Seuil"><input type="number" min="0" style={{...inputStyle,width:90}} value={ligne.seuil_alerte||5} onChange={e=>setAchatsLignes(achatsLignes.map((l,i)=>i===idx?{...l,seuil_alerte:e.target.value}:l))}/></Field></>}<Field label="Quantité"><input type="number" min="1" style={{...inputStyle,width:90}} value={ligne.quantite} onChange={e=>setAchatsLignes(achatsLignes.map((l,i)=>i===idx?{...l,quantite:e.target.value}:l))}/></Field><Field label="Prix achat"><input type="number" min="0" required style={{...inputStyle,width:120}} value={ligne.prix_unitaire} placeholder={p?.prix_achat || "0"} onChange={e=>setAchatsLignes(achatsLignes.map((l,i)=>i===idx?{...l,prix_unitaire:e.target.value}:l))}/></Field><Field label="Total"><div style={{...inputStyle,minWidth:130,background:`${TEAL}08`,fontWeight:800,color:TEAL}}>{fmt(total)}</div></Field>{achatsLignes.length>1 && <Button type="button" danger onClick={()=>setAchatsLignes(achatsLignes.filter((_,i)=>i!==idx))}>Retirer</Button>}</div>})}<div style={{flexBasis:"100%",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}><Button type="button" secondary onClick={()=>setAchatsLignes([...achatsLignes,{mode:"existant",produit_id:produits[0]?.id||"",nom:"",categorie_id:"",quantite:1,prix_unitaire:produits[0]?.prix_achat||"",prix_vente:"",seuil_alerte:5}])}><Plus size={15}/> Ajouter produit existant</Button><Button type="button" secondary onClick={()=>setAchatsLignes([...achatsLignes,{mode:"nouveau",produit_id:"",nom:"",categorie_id:"",quantite:1,prix_unitaire:"",prix_vente:"",seuil_alerte:5}])}><Plus size={15}/> Nouveau produit</Button><div style={{fontWeight:800,color:INK}}>Total achat : {fmt(achatsLignes.reduce((s,l)=>{const p=produits.find(x=>x.id===l.produit_id); const prix=Number(l.prix_unitaire || p?.prix_achat || 0); return s+Number(l.quantite||0)*prix},0))}</div></div><Button type="submit" disabled={!fournisseurs.length}><Plus size={15}/> Enregistrer l'achat</Button></form><Table headers={["Date","Produit","Fournisseur","Qté","PU","Total","Actions"]}>{achats.map(a=>{const p=produits.find(x=>x.id===a.produit_id); const f=fournisseurs.find(x=>x.id===a.fournisseur_id); return <tr key={a.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{a.date_achat}</td><td style={cell}>{p?.nom||"—"}</td><td style={cell}>{f?.nom||"—"}</td><td style={cell}>{a.quantite}</td><td style={cell}>{fmt(a.prix_unitaire)}</td><td style={{...cell,color:TEAL,fontWeight:800}}>{fmt(Number(a.quantite)*Number(a.prix_unitaire))}</td><td style={cell}><button onClick={()=>deleteRow("achats",a.id)} style={linkBtn(CORAL)}>Supprimer</button></td></tr>})}</Table></>}
        {tab === "caisse" && <>
          <SectionTitle title="Journal de caisse" sub="Classement journalier, filtres par période, type, mode de paiement et recherche rapide." />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:14, marginBottom:18 }}>
            <KpiCard label="Solde total caisses" value={fmt(soldeCaisses)} icon={DollarSign} accent={TEAL} />
            <KpiCard label="Entrées filtrées" value={fmt(caisseResumeFiltre.entrees)} icon={TrendingUp} accent={TEAL} />
            <KpiCard label="Sorties / dépenses" value={fmt(caisseResumeFiltre.sorties)} icon={Wallet} accent={CORAL} />
            <KpiCard label="Solde période" value={fmt(caisseResumeFiltre.solde)} icon={CreditCard} accent={caisseResumeFiltre.solde >= 0 ? TEAL : CORAL} />
          </div>

          <div style={{ background:CARD, border:`1px solid ${INK}0F`, borderRadius:14, padding:16, marginBottom:18, boxShadow:"0 1px 3px rgba(21,34,56,0.05)" }}>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"end"}}>
              <Field label="Période"><select style={{...inputStyle,minWidth:150}} value={caissePeriode} onChange={e=>{setCaissePeriode(e.target.value);setCaissePage(1);}}><option value="jour">Aujourd'hui</option><option value="semaine">Cette semaine</option><option value="mois">Ce mois</option><option value="annee">Cette année</option><option value="perso">Personnalisé</option></select></Field>
              {caissePeriode === "perso" && <><Field label="Du"><input type="date" style={inputStyle} value={caisseDateDebut} onChange={e=>{setCaisseDateDebut(e.target.value);setCaissePage(1);}} /></Field><Field label="Au"><input type="date" style={inputStyle} value={caisseDateFin} onChange={e=>{setCaisseDateFin(e.target.value);setCaissePage(1);}} /></Field></>}
              <Field label="Type"><select style={{...inputStyle,minWidth:130}} value={caisseTypeFilter} onChange={e=>{setCaisseTypeFilter(e.target.value);setCaissePage(1);}}><option value="tous">Tous</option><option value="entree">Entrées</option><option value="sortie">Sorties</option></select></Field>
              <Field label="Mode paiement"><select style={{...inputStyle,minWidth:165}} value={caisseModeFilter} onChange={e=>{setCaisseModeFilter(e.target.value);setCaissePage(1);}}><option value="tous">Tous les modes</option>{modesCaisseDisponibles.map(m=><option key={m} value={m}>{m}</option>)}</select></Field>
              <Field label="Recherche"><input style={{...inputStyle,minWidth:260}} placeholder="Référence, description, montant..." value={caisseSearch} onChange={e=>{setCaisseSearch(e.target.value);setCaissePage(1);}} /></Field>
              <Button type="button" secondary onClick={()=>{setCaisseSearch("");setCaisseTypeFilter("tous");setCaisseModeFilter("tous");setCaissePeriode("mois");setCaissePage(1);}}>Réinitialiser</Button>
            </div>
            <div style={{marginTop:10,fontSize:12.5,color:`${INK}99`,fontWeight:700}}>Période affichée : {caisseDateRange.label} — {formatDateFr(caisseDateRange.debut)} au {formatDateFr(caisseDateRange.fin)} — {caisseResumeFiltre.total} mouvement(s)</div>
          </div>

          <form onSubmit={saveCaisse} style={formStyle(CARD, INK)}><Field label="Nom caisse"><input required style={{...inputStyle,minWidth:180}} value={caisseForm.nom} onChange={e=>setCaisseForm({...caisseForm,nom:e.target.value})}/></Field><Field label="Solde initial"><input type="number" style={{...inputStyle,width:130}} value={caisseForm.solde} onChange={e=>setCaisseForm({...caisseForm,solde:e.target.value})}/></Field><Button type="submit"><Plus size={15}/> Créer caisse</Button></form>

          <form onSubmit={saveMouvementCaisse} style={formStyle(CARD, INK)}><Field label="Caisse"><select required style={{...inputStyle,minWidth:190}} value={mouvementCaisseForm.caisse_id} onChange={e=>setMouvementCaisseForm({...mouvementCaisseForm,caisse_id:e.target.value})}><option value="">Sélectionner</option>{caisses.map(c=><option key={c.id} value={c.id}>{c.nom} — {fmt(c.solde)}</option>)}</select></Field><Field label="Type"><select style={inputStyle} value={mouvementCaisseForm.type} onChange={e=>setMouvementCaisseForm({...mouvementCaisseForm,type:e.target.value})}><option value="entree">Entrée</option><option value="sortie">Sortie</option></select></Field><Field label="Mode paiement"><PaymentSelect style={inputStyle} value={mouvementCaisseForm.mode_paiement || "Espèces"} onChange={m=>setMouvementCaisseForm({...mouvementCaisseForm,mode_paiement:m})} /></Field><Field label="Montant"><input type="number" min="1" style={{...inputStyle,width:120}} value={mouvementCaisseForm.montant} onChange={e=>setMouvementCaisseForm({...mouvementCaisseForm,montant:e.target.value})}/></Field><Field label="Référence"><input style={{...inputStyle,minWidth:150}} value={mouvementCaisseForm.reference || ""} onChange={e=>setMouvementCaisseForm({...mouvementCaisseForm,reference:e.target.value})}/></Field><Field label="Description"><input style={{...inputStyle,minWidth:220}} value={mouvementCaisseForm.description} onChange={e=>setMouvementCaisseForm({...mouvementCaisseForm,description:e.target.value})}/></Field><Button type="submit" disabled={!caisses.length}>Enregistrer</Button></form>

          {mouvementsCaissesPage.length === 0 ? <div style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:18,color:`${INK}88`}}>Aucun mouvement trouvé pour ces critères.</div> : <Table headers={["Date / Heure","Caisse","Type","Mode","Référence","Montant","Description",""]}>{mouvementsCaissesPage.map(m=>{const c=caisses.find(x=>x.id===m.caisse_id); const mode=getModeCaisse(m); const ref=m.reference_operation || m.reference || "—"; return <tr key={m.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{m.created_at ? new Date(m.created_at).toLocaleString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}) : "—"}</td><td style={cell}>{c?.nom||"—"}</td><td style={{...cell,fontWeight:900,color:m.type==="entree"?TEAL:CORAL}}>{m.type === "entree" ? "Entrée" : "Sortie"}</td><td style={cell}><PaymentBadge mode={mode} /></td><td style={cell}>{ref}</td><td style={{...cell,color:m.type==="entree"?TEAL:CORAL,fontWeight:900}}>{fmt(m.montant)}</td><td style={{...cell,maxWidth:360}}>{m.description||"—"}</td><td style={cell}><button onClick={()=>deleteRow("mouvements_caisses",m.id)} style={linkBtn(CORAL)}>Supprimer</button></td></tr>})}</Table>}<PaginationPro page={caissePage} pages={pagesCaisse} setPage={setCaissePage} />
        </>}

        {tab === "banque" && <><SectionTitle title="Banque" sub="Suivez les dépôts, retraits et soldes bancaires." /><div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:18 }}><KpiCard label="Solde total banques" value={fmt(soldeBanques)} icon={CreditCard} accent={INK} /></div><form onSubmit={saveBanque} style={formStyle(CARD, INK)}><Field label="Banque"><input required style={{...inputStyle,minWidth:180}} value={banqueForm.nom} onChange={e=>setBanqueForm({...banqueForm,nom:e.target.value})}/></Field><Field label="N° compte"><input style={{...inputStyle,minWidth:160}} value={banqueForm.numero_compte} onChange={e=>setBanqueForm({...banqueForm,numero_compte:e.target.value})}/></Field><Field label="Solde initial"><input type="number" style={{...inputStyle,width:130}} value={banqueForm.solde} onChange={e=>setBanqueForm({...banqueForm,solde:e.target.value})}/></Field><Button type="submit"><Plus size={15}/> Créer banque</Button></form><form onSubmit={saveMouvementBanque} style={formStyle(CARD, INK)}><Field label="Banque"><select required style={{...inputStyle,minWidth:190}} value={mouvementBanqueForm.banque_id} onChange={e=>setMouvementBanqueForm({...mouvementBanqueForm,banque_id:e.target.value})}><option value="">Sélectionner</option>{banques.map(b=><option key={b.id} value={b.id}>{b.nom} — {fmt(b.solde)}</option>)}</select></Field><Field label="Type"><select style={inputStyle} value={mouvementBanqueForm.type} onChange={e=>setMouvementBanqueForm({...mouvementBanqueForm,type:e.target.value})}><option value="depot">Dépôt</option><option value="retrait">Retrait</option></select></Field><Field label="Montant"><input type="number" min="1" style={{...inputStyle,width:120}} value={mouvementBanqueForm.montant} onChange={e=>setMouvementBanqueForm({...mouvementBanqueForm,montant:e.target.value})}/></Field><Field label="Description"><input style={{...inputStyle,minWidth:220}} value={mouvementBanqueForm.description} onChange={e=>setMouvementBanqueForm({...mouvementBanqueForm,description:e.target.value})}/></Field><Button type="submit" disabled={!banques.length}>Enregistrer</Button></form><Table headers={["Date","Banque","Type","Montant","Description",""]}>{mouvementsBanques.map(m=>{const b=banques.find(x=>x.id===m.banque_id);return <tr key={m.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{new Date(m.created_at).toLocaleDateString("fr-FR")}</td><td style={cell}>{b?.nom||"—"}</td><td style={cell}>{m.type}</td><td style={{...cell,color:m.type==="depot"?TEAL:CORAL,fontWeight:800}}>{fmt(m.montant)}</td><td style={cell}>{m.description||"—"}</td><td style={cell}><button onClick={()=>deleteRow("mouvements_banques",m.id)} style={linkBtn(CORAL)}>Supprimer</button></td></tr>})}</Table></>}
        {tab === "creances" && <><SectionTitle title="Créances clients" sub="Suivez les montants dus par vos clients." /><div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:18 }}><KpiCard label="Créances impayées" value={fmt(totalCreances)} icon={FileText} accent={MUSTARD} /></div><form onSubmit={saveCreance} style={formStyle(CARD, INK)}><Field label="Client"><select required style={{...inputStyle,minWidth:190}} value={creanceForm.client_id} onChange={e=>setCreanceForm({...creanceForm,client_id:e.target.value})}><option value="">Sélectionner</option>{clients.map(c=><option key={c.id} value={c.id}>{codeClient(c)} — {c.nom}</option>)}</select></Field><Field label="Montant"><input type="number" min="1" style={{...inputStyle,width:130}} value={creanceForm.montant} onChange={e=>setCreanceForm({...creanceForm,montant:e.target.value})}/></Field><Field label="Échéance"><input type="date" style={inputStyle} value={creanceForm.date_echeance} onChange={e=>setCreanceForm({...creanceForm,date_echeance:e.target.value})}/></Field><Button type="submit">Ajouter</Button></form><Table headers={["Client","Montant","Échéance","Statut","Actions"]}>{creances.map(c=>{const cl=clients.find(x=>x.id===c.client_id);return <tr key={c.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{cl?.nom||"—"}</td><td style={{...cell,color:MUSTARD,fontWeight:800}}>{fmt(c.montant)}</td><td style={cell}>{c.date_echeance||"—"}</td><td style={cell}>{c.statut}</td><td style={cell}>{c.statut!=="paye"&&<button onClick={()=>marquerPaye("creances",c.id)} style={linkBtn(TEAL)}>Marquer payé</button>}<button onClick={()=>deleteRow("creances",c.id)} style={linkBtn(CORAL)}>Supprimer</button></td></tr>})}</Table></>}
        {tab === "dettes" && <><SectionTitle title="Dettes fournisseurs" sub="Suivez les montants dus à vos fournisseurs." /><div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:18 }}><KpiCard label="Dettes impayées" value={fmt(totalDettes)} icon={Wallet} accent={CORAL} /></div><form onSubmit={saveDette} style={formStyle(CARD, INK)}><Field label="Fournisseur"><select required style={{...inputStyle,minWidth:190}} value={detteForm.fournisseur_id} onChange={e=>setDetteForm({...detteForm,fournisseur_id:e.target.value})}><option value="">Sélectionner</option>{fournisseurs.map(f=><option key={f.id} value={f.id}>{codeFournisseur(f)} — {f.nom}</option>)}</select></Field><Field label="Montant"><input type="number" min="1" style={{...inputStyle,width:130}} value={detteForm.montant} onChange={e=>setDetteForm({...detteForm,montant:e.target.value})}/></Field><Field label="Échéance"><input type="date" style={inputStyle} value={detteForm.date_echeance} onChange={e=>setDetteForm({...detteForm,date_echeance:e.target.value})}/></Field><Button type="submit">Ajouter</Button></form><Table headers={["Fournisseur","Montant","Échéance","Statut","Actions"]}>{dettes.map(d=>{const f=fournisseurs.find(x=>x.id===d.fournisseur_id);return <tr key={d.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{f?.nom||"—"}</td><td style={{...cell,color:CORAL,fontWeight:800}}>{fmt(d.montant)}</td><td style={cell}>{d.date_echeance||"—"}</td><td style={cell}>{d.statut}</td><td style={cell}>{d.statut!=="paye"&&<button onClick={()=>marquerPaye("dettes",d.id)} style={linkBtn(TEAL)}>Marquer payé</button>}<button onClick={()=>deleteRow("dettes",d.id)} style={linkBtn(CORAL)}>Supprimer</button></td></tr>})}</Table></>}
        
        
        {tab === "utilisateurs" && can("utilisateurs") && <><SectionTitle title="Gestion des utilisateurs" sub="Invitez les employés, attribuez les rôles et contrôlez les accès." />{isSuperAdmin && <form onSubmit={creerUtilisateurDirect} style={formStyle(CARD, INK)}><Field label="Nom complet"><input required style={{...inputStyle,minWidth:190}} value={newUserForm.nom_complet} onChange={e=>setNewUserForm({...newUserForm,nom_complet:e.target.value})}/></Field><Field label="Email"><input type="email" required style={{...inputStyle,minWidth:210}} value={newUserForm.email} onChange={e=>setNewUserForm({...newUserForm,email:e.target.value})}/></Field><Field label="Téléphone"><PhoneSNInput value={newUserForm.telephone} onChange={v=>setNewUserForm({...newUserForm,telephone:v})} style={inputStyle}/></Field><Field label="Rôle"><select style={inputStyle} value={newUserForm.poste} onChange={e=>setNewUserForm({...newUserForm,poste:e.target.value})}><option value="caissier">Caissier</option><option value="magasinier">Magasinier</option><option value="comptable">Comptable</option><option value="employe">Employé</option><option value="gerant">Gérant</option></select></Field><Button type="submit"><Plus size={15}/> Créer utilisateur</Button></form>}{newUserAccess && <div style={{background:`${TEAL}10`,border:`1px solid ${TEAL}33`,borderRadius:10,padding:14,marginBottom:16,fontSize:13}}><b>Accès générés :</b><br/>Nom : {newUserAccess.nom_complet}<br/>Email : {newUserAccess.email}<br/>Mot de passe temporaire : <b>{newUserAccess.password}</b><br/>Rôle : {ROLE_LABELS[newUserAccess.poste] || newUserAccess.poste}<div style={{marginTop:10}}><Button type="button" onClick={copierAccesUtilisateur}><Copy size={15}/> Copier les accès</Button></div></div>}<div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:18 }}><KpiCard label="Utilisateurs actifs" value={utilisateursFiltres.filter(u=>u.actif!==false).length} icon={Users} accent={TEAL} /><KpiCard label="Gérants" value={utilisateursFiltres.filter(u=>(u.poste||u.role)==="gerant").length} icon={Users} accent={INK} /><KpiCard label="Caissiers" value={utilisateursFiltres.filter(u=>(u.poste||u.role)==="caissier").length} icon={ShoppingCart} accent={MUSTARD} /><KpiCard label="Désactivés" value={utilisateursFiltres.filter(u=>u.actif===false).length} icon={Users} accent={CORAL} /></div><div style={{ background: CARD, border: `1px solid ${INK}0F`, borderRadius: 12, padding: 16, marginBottom: 18 }}><div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"flex-end" }}><Field label="Rechercher"><input style={{...inputStyle,minWidth:220}} placeholder="Nom, code ou rôle" value={utilisateurSearch} onChange={e=>setUtilisateurSearch(e.target.value)}/></Field><Field label="Rôle à inviter"><select style={inputStyle} value={nouvelInviteRole} onChange={e=>setNouvelInviteRole(e.target.value)}>{Object.entries(ROLE_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></Field><Button type="button" onClick={()=>copierInvitation(nouvelInviteRole)}><Copy size={15}/> Copier invitation</Button></div><div style={{ marginTop: 12, fontSize: 13, color: `${INK}99` }}>{isSuperAdmin ? <b>Code d'invitation :</b> : <div style={{background:`${TEAL}10`,border:`1px solid ${TEAL}33`,borderRadius:10,padding:12,fontSize:13}}><b>Création utilisateur :</b> envoyez une demande au Super Admin via la messagerie interne.</div>} {entreprise?.code_invitation} — L'employé crée son compte puis choisit « Rejoindre une équipe ».</div><div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end",marginTop:14}}><Field label="Filtrer rôle"><select style={inputStyle} value={utilisateurRoleFilter} onChange={e=>{setUtilisateurRoleFilter(e.target.value);setUtilisateursPage(1);}}><option value="tous">Tous</option><option value="gerant">Gérant</option><option value="caissier">Caissier</option><option value="magasinier">Magasinier</option><option value="comptable">Comptable</option><option value="employe">Employé</option></select></Field><Field label="Statut"><select style={inputStyle} value={utilisateurStatutFilter} onChange={e=>{setUtilisateurStatutFilter(e.target.value);setUtilisateursPage(1);}}><option value="tous">Tous</option><option value="actif">Actif</option><option value="desactive">Désactivé</option></select></Field><div style={{marginLeft:"auto",fontSize:12.5,color:`${INK}88`,fontWeight:800}}>{utilisateursFiltresPro.length} utilisateur(s) — 5 lignes par page</div></div></div><div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:10, marginBottom:18 }}>{Object.entries(ROLE_LABELS).map(([role,label])=><div key={role} style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:10,padding:12}}><div style={{fontWeight:800,color:role==="gerant"?TEAL:INK}}>{label}</div><div style={{fontSize:12,color:`${INK}88`,marginTop:4}}>{ROLE_DESCRIPTIONS[role]}</div></div>)}</div><Table headers={["Code", "Nom", "Rôle/Poste", "Statut", "Entreprise", "Date création", "Actions"]}>{utilisateursPageRows.map(u => { const role = u.poste || u.role || "employe"; const actif = u.actif !== false; return <tr key={u.id} style={{borderTop:`1px solid ${INK}0D`, background: !actif ? `${CORAL}08` : "transparent"}}><td style={cell}>{codeUtilisateur(u)}</td><td style={cell}>{u.nom_complet || "Utilisateur"}</td><td style={cell}><span style={{fontWeight:800,color:role==="gerant"?TEAL:INK}}>{ROLE_LABELS[role] || role}</span><div style={{fontSize:11,color:`${INK}77`,marginTop:2}}>{ROLE_DESCRIPTIONS[role] || ""}</div></td><td style={cell}><span style={{fontWeight:800,color:actif?TEAL:CORAL}}>{actif ? "Actif" : "Désactivé"}</span></td><td style={cell}>{u.entreprise_id === entreprise?.id ? entreprise?.nom : "—"}</td><td style={cell}>{u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR") : "—"}</td><td style={cell}><select style={{...inputStyle,marginBottom:6}} value={role} onChange={e=>changerPosteUtilisateur(u.id,e.target.value)} disabled={u.id===profil.id}><option value="gerant">Gérant</option><option value="caissier">Caissier</option><option value="magasinier">Magasinier</option><option value="comptable">Comptable</option><option value="employe">Employé</option></select><br/>{u.id!==profil.id && <button onClick={()=>changerStatutUtilisateur(u.id,!actif)} style={linkBtn(actif?CORAL:TEAL)}>{actif ? "Désactiver" : "Réactiver"}</button>}</td></tr>})}</Table><PaginationPro page={utilisateursPage} pages={pagesUtilisateurs} setPage={setUtilisateursPage} /></>}
        
        {tab === "rapports" && can("rapports") && <><SectionTitle title="Rapports & Exports" sub="Analysez et exportez vos données commerciales et financières." /><div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:18 }}><KpiCard label="Lignes rapport" value={rapportCourant.length} icon={FileText} accent={TEAL} /><KpiCard label="Total rapport" value={fmt(totalRapport)} icon={TrendingUp} accent={INK} /><KpiCard label="Période début" value={formatDateFr(rapportDebut)} icon={FileText} accent={MUSTARD} /><KpiCard label="Période fin" value={formatDateFr(rapportFin)} icon={FileText} accent={CORAL} /></div><div style={{ background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:16,marginBottom:18 }}><div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}><Field label="Type de rapport"><select style={{...inputStyle,minWidth:210}} value={rapportType} onChange={e=>setRapportType(e.target.value)}><option value="ventes">Ventes</option><option value="achats">Achats</option><option value="depenses">Dépenses</option><option value="stocks">Stocks</option><option value="creances_dettes">Créances & Dettes</option></select></Field>{rapportType!=="stocks" && <><Field label="Date début"><input type="date" style={inputStyle} value={rapportDebut} onChange={e=>setRapportDebut(e.target.value)}/></Field><Field label="Date fin"><input type="date" style={inputStyle} value={rapportFin} onChange={e=>setRapportFin(e.target.value)}/></Field></>}<Button type="button" onClick={exporterRapportCSV}><FileText size={15}/> Export CSV/Excel</Button><Button type="button" secondary onClick={imprimerRapport}><FileText size={15}/> Imprimer PDF</Button><Field label="Recherche"><input style={{...inputStyle,minWidth:240}} placeholder="Rechercher dans le rapport..." value={rapportSearch} onChange={e=>{setRapportSearch(e.target.value);setRapportPage(1);}}/></Field><div style={{marginLeft:"auto",fontSize:12.5,color:`${INK}88`,fontWeight:800}}>{rapportFiltrePro.length} ligne(s) — 5 lignes par page</div></div></div>{rapportType==="ventes" && <Table headers={["Date","Référence","Client","Produit","Qté","PU","Total","Statut","Paiement"]}>{rapportPageRows.map((r,i)=><tr key={i} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{r.date}</td><td style={cell}>{r.reference}</td><td style={cell}>{r.client}</td><td style={cell}>{r.produit}</td><td style={cell}>{r.quantite}</td><td style={cell}>{fmt(r.prix)}</td><td style={{...cell,color:TEAL,fontWeight:800}}>{fmt(r.total)}</td><td style={cell}>{r.statut}</td><td style={cell}>{r.paiement}</td></tr>)}</Table>}{rapportType==="achats" && <Table headers={["Date","Fournisseur","Produit","Qté","PU","Total"]}>{rapportPageRows.map((r,i)=><tr key={i} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{r.date}</td><td style={cell}>{r.fournisseur}</td><td style={cell}>{r.produit}</td><td style={cell}>{r.quantite}</td><td style={cell}>{fmt(r.prix)}</td><td style={{...cell,color:TEAL,fontWeight:800}}>{fmt(r.total)}</td></tr>)}</Table>}{rapportType==="depenses" && <Table headers={["Date","Catégorie","Description","Montant"]}>{rapportPageRows.map((r,i)=><tr key={i} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{r.date}</td><td style={cell}>{r.categorie}</td><td style={cell}>{r.description}</td><td style={{...cell,color:CORAL,fontWeight:800}}>{fmt(r.montant)}</td></tr>)}</Table>}{rapportType==="stocks" && <Table headers={["Code","Produit","Qté","Seuil","Prix achat","Prix vente","Valeur","Statut"]}>{rapportPageRows.map((r,i)=><tr key={i} style={{borderTop:`1px solid ${INK}0D`,background:r.statut==="Stock bas"?`${CORAL}08`:"transparent"}}><td style={cell}>{r.code}</td><td style={cell}>{r.produit}</td><td style={cell}>{r.quantite}</td><td style={cell}>{r.seuil}</td><td style={cell}>{fmt(r.prixAchat)}</td><td style={cell}>{fmt(r.prixVente)}</td><td style={{...cell,color:TEAL,fontWeight:800}}>{fmt(r.valeur)}</td><td style={cell}>{r.statut}</td></tr>)}</Table>}{rapportType==="creances_dettes" && <Table headers={["Type","Tiers","Montant","Échéance","Statut"]}>{rapportPageRows.map((r,i)=><tr key={i} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{r.type}</td><td style={cell}>{r.tiers}</td><td style={{...cell,color:r.type.includes("Créance")?MUSTARD:CORAL,fontWeight:800}}>{fmt(r.montant)}</td><td style={cell}>{r.echeance}</td><td style={cell}>{r.statut}</td></tr>)}</Table>}<PaginationPro page={rapportPage} pages={pagesRapport} setPage={setRapportPage} /></>}

        
        {tab === "comptabilite" && can("comptabilite") && <><SectionTitle title="Comptabilité avancée" sub="Journal, grand livre, balance et résultat mensuel." /><div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:18 }}><KpiCard label="Trésorerie disponible" value={fmt(tresorerieDisponible)} icon={Wallet} accent={TEAL} /><KpiCard label="Résultat journalier" value={fmt(resultatJournalier)} icon={TrendingUp} accent={resultatJournalier>=0?TEAL:CORAL} /><KpiCard label="Résultat hebdo" value={fmt(resultatHebdo)} icon={TrendingUp} accent={resultatHebdo>=0?TEAL:CORAL} /><KpiCard label="Résultat mensuel" value={fmt(resultatMensuel)} icon={TrendingUp} accent={resultatMensuel>=0?TEAL:CORAL} /><KpiCard label="Résultat annuel" value={fmt(resultatAnnuel)} icon={TrendingUp} accent={resultatAnnuel>=0?TEAL:CORAL} /><KpiCard label="Total débit" value={fmt(totalDebitComptable)} icon={FileText} accent={INK} /><KpiCard label="Total crédit" value={fmt(totalCreditComptable)} icon={FileText} accent={MUSTARD} /></div><form onSubmit={saveJournalComptable} style={formStyle(CARD, INK)}><Field label="Type"><select style={inputStyle} value={journalForm.type_operation} onChange={e=>setJournalForm({...journalForm,type_operation:e.target.value})}><option value="ajustement">Ajustement</option><option value="vente">Vente</option><option value="achat">Achat</option><option value="depense">Dépense</option><option value="paiement">Paiement</option><option value="autre">Autre</option></select></Field><Field label="Référence"><input style={{...inputStyle,minWidth:150}} value={journalForm.reference} onChange={e=>setJournalForm({...journalForm,reference:e.target.value})}/></Field><Field label="Description"><input required style={{...inputStyle,minWidth:260}} value={journalForm.description} onChange={e=>setJournalForm({...journalForm,description:e.target.value})}/></Field><Field label="Débit"><input type="number" min="0" style={{...inputStyle,width:120}} value={journalForm.debit} onChange={e=>setJournalForm({...journalForm,debit:e.target.value})}/></Field><Field label="Crédit"><input type="number" min="0" style={{...inputStyle,width:120}} value={journalForm.credit} onChange={e=>setJournalForm({...journalForm,credit:e.target.value})}/></Field><Button type="submit"><Plus size={15}/> Ajouter écriture</Button></form><SectionTitle title="Dashboard financier détaillé" /><Table headers={["Période","Chiffre d'affaires","Achats","Dépenses","Résultat"]}>{resumeFinancier.map((r)=><tr key={r.label} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{r.label}</td><td style={{...cell,color:TEAL,fontWeight:800}}>{fmt(r.ventes)}</td><td style={cell}>{fmt(r.achats)}</td><td style={cell}>{fmt(r.depenses)}</td><td style={{...cell,color:r.resultat>=0?TEAL:CORAL,fontWeight:900}}>{fmt(r.resultat)}</td></tr>)}</Table><div style={{height:18}}/><SectionTitle title="Balance comptable" /><Table headers={["Compte","Débit","Crédit","Solde"]}>{balanceComptable.map((b,i)=><tr key={i} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{b.compte}</td><td style={cell}>{fmt(b.debit)}</td><td style={cell}>{fmt(b.credit)}</td><td style={{...cell,color:b.solde>=0?TEAL:CORAL,fontWeight:800}}>{fmt(b.solde)}</td></tr>)}</Table><div style={{height:18}}/><SectionTitle title="Journal comptable" /><div style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:14,marginBottom:12,display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}><Field label="Recherche"><input style={{...inputStyle,minWidth:240}} placeholder="Référence, description, montant..." value={journalSearch} onChange={e=>{setJournalSearch(e.target.value);setJournalPage(1);}}/></Field><Field label="Du"><input type="date" style={inputStyle} value={journalDateDebut} onChange={e=>{setJournalDateDebut(e.target.value);setJournalPage(1);}}/></Field><Field label="Au"><input type="date" style={inputStyle} value={journalDateFin} onChange={e=>{setJournalDateFin(e.target.value);setJournalPage(1);}}/></Field><Field label="Type"><select style={inputStyle} value={journalTypeFilter} onChange={e=>{setJournalTypeFilter(e.target.value);setJournalPage(1);}}><option value="tous">Tous</option><option value="vente">Vente</option><option value="achat">Achat</option><option value="depense">Dépense</option><option value="paiement">Paiement</option><option value="ajustement">Ajustement</option><option value="autre">Autre</option></select></Field><div style={{marginLeft:"auto",fontSize:12.5,color:`${INK}88`,fontWeight:800}}>{journalFiltresPro.length} écriture(s) — 5 lignes par page</div></div><Table headers={["Date","Type","Référence","Description","Débit","Crédit"]}>{journalPageRows.map((j,i)=><tr key={j.id||i} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{j.date_operation}</td><td style={cell}>{j.type_operation}</td><td style={cell}>{j.reference||"—"}</td><td style={cell}>{j.description}</td><td style={cell}>{fmt(j.debit)}</td><td style={cell}>{fmt(j.credit)}</td></tr>)}</Table><PaginationPro page={journalPage} pages={pagesJournal} setPage={setJournalPage} /></>}

        
        {tab === "rh" && can("rh") && <><SectionTitle title="Ressources Humaines" sub="Employés, présences, salaires, avances et congés." /><div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:18 }}><KpiCard label="Employés actifs" value={employes.filter(e=>e.statut==="actif").length} icon={Users} accent={TEAL} /><KpiCard label="Présences du jour" value={presencesJour} icon={Calendar} accent={INK} /><KpiCard label="Salaires du mois" value={fmt(totalSalairesMois)} icon={Wallet} accent={MUSTARD} /><KpiCard label="Avances du mois" value={fmt(totalAvancesMois)} icon={Wallet} accent={CORAL} /><KpiCard label="Congés en attente" value={congesEnAttente} icon={Calendar} accent={CORAL} /></div><SectionTitle title="Employés" /><form onSubmit={saveEmploye} style={formStyle(CARD, INK)}><Field label="Nom complet"><input required style={{...inputStyle,minWidth:210}} value={employeForm.nom_complet} onChange={e=>setEmployeForm({...employeForm,nom_complet:e.target.value})}/></Field><Field label="Téléphone"><PhoneSNInput value={employeForm.telephone} onChange={v=>setEmployeForm({...employeForm,telephone:v})} style={inputStyle}/></Field><Field label="Email"><input type="email" style={{...inputStyle,minWidth:190}} value={employeForm.email} onChange={e=>setEmployeForm({...employeForm,email:e.target.value})}/></Field><Field label="Poste"><input style={{...inputStyle,minWidth:160}} value={employeForm.poste} onChange={e=>setEmployeForm({...employeForm,poste:e.target.value})}/></Field><Field label="Salaire base"><input type="number" min="0" style={{...inputStyle,width:130}} value={employeForm.salaire_base} onChange={e=>setEmployeForm({...employeForm,salaire_base:e.target.value})}/></Field><Field label="Embauche"><input type="date" style={inputStyle} value={employeForm.date_embauche} onChange={e=>setEmployeForm({...employeForm,date_embauche:e.target.value})}/></Field><Field label="Statut"><select style={inputStyle} value={employeForm.statut} onChange={e=>setEmployeForm({...employeForm,statut:e.target.value})}><option value="actif">Actif</option><option value="inactif">Inactif</option></select></Field><Button type="submit"><Plus size={15}/> {employeForm.id ? "Modifier" : "Ajouter"}</Button>{employeForm.id && <Button secondary onClick={()=>setEmployeForm({ id:null, nom_complet:"", telephone:"", email:"", poste:"", salaire_base:"", date_embauche:today(), statut:"actif" })}>Annuler</Button>}</form><div style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:14,marginBottom:12,display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}><Field label="Recherche"><input style={{...inputStyle,minWidth:240}} placeholder="Nom, téléphone, poste..." value={employesSearch} onChange={e=>{setEmployesSearch(e.target.value);setEmployesPage(1);}}/></Field><Field label="Statut"><select style={inputStyle} value={employesStatutFilter} onChange={e=>{setEmployesStatutFilter(e.target.value);setEmployesPage(1);}}><option value="tous">Tous</option><option value="actif">Actif</option><option value="inactif">Inactif</option></select></Field><div style={{marginLeft:"auto",fontSize:12.5,color:`${INK}88`,fontWeight:800}}>{employesFiltresPro.length} employé(s) — 5 lignes par page</div></div><Table headers={["Nom","Téléphone","Email","Poste","Salaire","Embauche","Statut","Actions"]}>{employesPageRows.map(emp=><tr key={emp.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{emp.nom_complet}</td><td style={cell}>{emp.telephone||"—"}</td><td style={cell}>{emp.email||"—"}</td><td style={cell}>{emp.poste||"—"}</td><td style={cell}>{fmt(emp.salaire_base)}</td><td style={cell}>{emp.date_embauche}</td><td style={cell}>{emp.statut}</td><td style={cell}><button onClick={()=>setEmployeForm({...emp,salaire_base:String(emp.salaire_base||0),telephone:emp.telephone||""})} style={linkBtn(TEAL)}>Modifier</button><button onClick={()=>deleteRow("employes",emp.id)} style={linkBtn(CORAL)}>Supprimer</button></td></tr>)}</Table><PaginationPro page={employesPage} pages={pagesEmployes} setPage={setEmployesPage} /><div style={{height:18}}/><SectionTitle title="Présences" /><form onSubmit={savePresence} style={formStyle(CARD, INK)}><Field label="Employé"><select required style={{...inputStyle,minWidth:220}} value={presenceForm.employe_id} onChange={e=>setPresenceForm({...presenceForm,employe_id:e.target.value})}>{employes.map(emp=><option key={emp.id} value={emp.id}>{emp.nom_complet}</option>)}</select></Field><Field label="Date"><input type="date" style={inputStyle} value={presenceForm.date_presence} onChange={e=>setPresenceForm({...presenceForm,date_presence:e.target.value})}/></Field><Field label="Statut"><select style={inputStyle} value={presenceForm.statut} onChange={e=>setPresenceForm({...presenceForm,statut:e.target.value})}><option value="present">Présent</option><option value="absent">Absent</option><option value="retard">Retard</option></select></Field><Field label="Arrivée"><input type="time" style={inputStyle} value={presenceForm.heure_arrivee} onChange={e=>setPresenceForm({...presenceForm,heure_arrivee:e.target.value})}/></Field><Field label="Départ"><input type="time" style={inputStyle} value={presenceForm.heure_depart} onChange={e=>setPresenceForm({...presenceForm,heure_depart:e.target.value})}/></Field><Field label="Note"><input style={{...inputStyle,minWidth:200}} value={presenceForm.note} onChange={e=>setPresenceForm({...presenceForm,note:e.target.value})}/></Field><Button type="submit">Enregistrer présence</Button></form><div style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:14,marginBottom:12,display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}><Field label="Recherche"><input style={{...inputStyle,minWidth:220}} placeholder="Employé, note..." value={presencesSearch} onChange={e=>{setPresencesSearch(e.target.value);setPresencesPage(1);}}/></Field><Field label="Du"><input type="date" style={inputStyle} value={presencesDateDebut} onChange={e=>{setPresencesDateDebut(e.target.value);setPresencesPage(1);}}/></Field><Field label="Au"><input type="date" style={inputStyle} value={presencesDateFin} onChange={e=>{setPresencesDateFin(e.target.value);setPresencesPage(1);}}/></Field><Field label="Statut"><select style={inputStyle} value={presencesStatutFilter} onChange={e=>{setPresencesStatutFilter(e.target.value);setPresencesPage(1);}}><option value="tous">Tous</option><option value="present">Présent</option><option value="absent">Absent</option><option value="retard">Retard</option></select></Field><div style={{marginLeft:"auto",fontSize:12.5,color:`${INK}88`,fontWeight:800}}>{presencesFiltresPro.length} présence(s) — 5 lignes par page</div></div><Table headers={["Date","Employé","Statut","Arrivée","Départ","Note"]}>{presencesPageRows.map(p=>{const emp=employes.find(e=>e.id===p.employe_id);return <tr key={p.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{p.date_presence}</td><td style={cell}>{emp?.nom_complet||"—"}</td><td style={cell}>{p.statut}</td><td style={cell}>{p.heure_arrivee||"—"}</td><td style={cell}>{p.heure_depart||"—"}</td><td style={cell}>{p.note||"—"}</td></tr>})}</Table><PaginationPro page={presencesPage} pages={pagesPresences} setPage={setPresencesPage} /><div style={{height:18}}/><SectionTitle title="Avances sur salaire" /><form onSubmit={saveAvanceSalaire} style={formStyle(CARD, INK)}><Field label="Employé"><select required style={{...inputStyle,minWidth:220}} value={avanceForm.employe_id} onChange={e=>setAvanceForm({...avanceForm,employe_id:e.target.value})}>{employes.map(emp=><option key={emp.id} value={emp.id}>{emp.nom_complet}</option>)}</select></Field><Field label="Montant"><input type="number" min="1" style={{...inputStyle,width:130}} value={avanceForm.montant} onChange={e=>setAvanceForm({...avanceForm,montant:e.target.value})}/></Field><Field label="Date"><input type="date" style={inputStyle} value={avanceForm.date_avance} onChange={e=>setAvanceForm({...avanceForm,date_avance:e.target.value})}/></Field><Field label="Motif"><input style={{...inputStyle,minWidth:220}} value={avanceForm.motif} onChange={e=>setAvanceForm({...avanceForm,motif:e.target.value})}/></Field><Button type="submit">Enregistrer avance</Button></form><div style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:14,marginBottom:12,display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}><Field label="Recherche"><input style={{...inputStyle,minWidth:240}} placeholder="Employé, date, motif, montant..." value={avancesSearch} onChange={e=>{setAvancesSearch(e.target.value);setAvancesPage(1);}}/></Field><div style={{marginLeft:"auto",fontSize:12.5,color:`${INK}88`,fontWeight:800}}>{avancesFiltresPro.length} avance(s) — 5 lignes par page</div></div><Table headers={["Date","Employé","Montant","Motif"]}>{avancesPageRows.map(a=>{const emp=employes.find(e=>e.id===a.employe_id);return <tr key={a.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{a.date_avance}</td><td style={cell}>{emp?.nom_complet||"—"}</td><td style={{...cell,color:CORAL,fontWeight:800}}>{fmt(a.montant)}</td><td style={cell}>{a.motif||"—"}</td></tr>})}</Table><PaginationPro page={avancesPage} pages={pagesAvances} setPage={setAvancesPage} /><div style={{height:18}}/><SectionTitle title="Salaires" /><form onSubmit={saveSalaire} style={formStyle(CARD, INK)}><Field label="Employé"><select required style={{...inputStyle,minWidth:220}} value={salaireForm.employe_id} onChange={e=>setSalaireForm({...salaireForm,employe_id:e.target.value})}>{employes.map(emp=><option key={emp.id} value={emp.id}>{emp.nom_complet} — {fmt(emp.salaire_base)}</option>)}</select></Field><Field label="Mois"><input type="month" style={inputStyle} value={salaireForm.mois} onChange={e=>setSalaireForm({...salaireForm,mois:e.target.value})}/></Field><Field label="Primes"><input type="number" min="0" style={{...inputStyle,width:120}} value={salaireForm.primes} onChange={e=>setSalaireForm({...salaireForm,primes:e.target.value})}/></Field><Field label="Retenues"><input type="number" min="0" style={{...inputStyle,width:120}} value={salaireForm.retenues} onChange={e=>setSalaireForm({...salaireForm,retenues:e.target.value})}/></Field><Button type="submit">Générer salaire</Button></form><div style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:14,marginBottom:12,display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}><Field label="Recherche"><input style={{...inputStyle,minWidth:240}} placeholder="Employé, mois, statut..." value={salairesSearch} onChange={e=>{setSalairesSearch(e.target.value);setSalairesPage(1);}}/></Field><div style={{marginLeft:"auto",fontSize:12.5,color:`${INK}88`,fontWeight:800}}>{salairesFiltresPro.length} salaire(s) — 5 lignes par page</div></div><Table headers={["Mois","Employé","Base","Avances","Primes","Retenues","Net","Statut","Actions"]}>{salairesPageRows.map(s=>{const emp=employes.find(e=>e.id===s.employe_id);return <tr key={s.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{s.mois}</td><td style={cell}>{emp?.nom_complet||"—"}</td><td style={cell}>{fmt(s.salaire_base)}</td><td style={cell}>{fmt(s.avances)}</td><td style={cell}>{fmt(s.primes)}</td><td style={cell}>{fmt(s.retenues)}</td><td style={{...cell,color:TEAL,fontWeight:900}}>{fmt(s.net_a_payer)}</td><td style={cell}>{s.statut}</td><td style={cell}><button onClick={()=>imprimerBulletin(s)} style={linkBtn(TEAL)}>Bulletin</button>{s.statut!=="paye"&&<button onClick={()=>changerStatutSalaire(s.id,"paye")} style={linkBtn(INK)}>Payé</button>}</td></tr>})}</Table><PaginationPro page={salairesPage} pages={pagesSalaires} setPage={setSalairesPage} /><div style={{height:18}}/><SectionTitle title="Congés" /><form onSubmit={saveConge} style={formStyle(CARD, INK)}><Field label="Employé"><select required style={{...inputStyle,minWidth:220}} value={congeForm.employe_id} onChange={e=>setCongeForm({...congeForm,employe_id:e.target.value})}>{employes.map(emp=><option key={emp.id} value={emp.id}>{emp.nom_complet}</option>)}</select></Field><Field label="Début"><input type="date" style={inputStyle} value={congeForm.date_debut} onChange={e=>setCongeForm({...congeForm,date_debut:e.target.value})}/></Field><Field label="Fin"><input type="date" style={inputStyle} value={congeForm.date_fin} onChange={e=>setCongeForm({...congeForm,date_fin:e.target.value})}/></Field><Field label="Type"><select style={inputStyle} value={congeForm.type_conge} onChange={e=>setCongeForm({...congeForm,type_conge:e.target.value})}><option value="annuel">Annuel</option><option value="maladie">Maladie</option><option value="permission">Permission</option><option value="autre">Autre</option></select></Field><Field label="Statut"><select style={inputStyle} value={congeForm.statut} onChange={e=>setCongeForm({...congeForm,statut:e.target.value})}><option value="en_attente">En attente</option><option value="approuve">Approuvé</option><option value="refuse">Refusé</option></select></Field><Field label="Motif"><input style={{...inputStyle,minWidth:220}} value={congeForm.motif} onChange={e=>setCongeForm({...congeForm,motif:e.target.value})}/></Field><Button type="submit">Ajouter congé</Button></form><div style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:14,marginBottom:12,display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}><Field label="Recherche"><input style={{...inputStyle,minWidth:240}} placeholder="Employé, type, statut, motif..." value={congesSearch} onChange={e=>{setCongesSearch(e.target.value);setCongesPage(1);}}/></Field><div style={{marginLeft:"auto",fontSize:12.5,color:`${INK}88`,fontWeight:800}}>{congesFiltresPro.length} congé(s) — 5 lignes par page</div></div><Table headers={["Employé","Début","Fin","Type","Statut","Motif","Actions"]}>{congesPageRows.map(c=>{const emp=employes.find(e=>e.id===c.employe_id);return <tr key={c.id} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{emp?.nom_complet||"—"}</td><td style={cell}>{c.date_debut}</td><td style={cell}>{c.date_fin}</td><td style={cell}>{c.type_conge}</td><td style={cell}>{c.statut}</td><td style={cell}>{c.motif||"—"}</td><td style={cell}>{c.statut==="en_attente"&&<><button onClick={()=>changerStatutConge(c.id,"approuve")} style={linkBtn(TEAL)}>Approuver</button><button onClick={()=>changerStatutConge(c.id,"refuse")} style={linkBtn(CORAL)}>Refuser</button></>}</td></tr>})}</Table><PaginationPro page={congesPage} pages={pagesConges} setPage={setCongesPage} /></>}

        
        {tab === "data_ia" && can("data_ia") && <><SectionTitle title="Data & IA" sub="KPI avancés, prévisions, alertes intelligentes et détection d'anomalies." /><div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:18 }}><KpiCard label="Score santé PME" value={`${scoreSante}/100`} icon={TrendingUp} accent={scoreSante>=70?TEAL:scoreSante>=40?MUSTARD:CORAL} /><KpiCard label="Prévision CA 30j" value={fmt(previsionCA30)} icon={TrendingUp} accent={TEAL} /><KpiCard label="Prévision CA 90j" value={fmt(previsionCA90)} icon={TrendingUp} accent={INK} /><KpiCard label="Anomalies détectées" value={anomaliesAuto.length + anomalies.filter(a=>a.statut==="ouverte").length} icon={AlertTriangle} accent={CORAL} /></div><div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:18 }}><Button type="button" onClick={genererPrevisionsDataIA}><Plus size={15}/> Générer prévisions & anomalies</Button></div><div style={{ background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:16,marginBottom:18 }}><SectionTitle title="Prévisions de chiffre d'affaires" /><ResponsiveContainer width="100%" height={240}><ComposedChart data={previsionVentesGraph}><CartesianGrid stroke={LINE} vertical={false} /><XAxis dataKey="periode" /><YAxis tickFormatter={(v)=>`${Math.round(v/1000)}k`} /><Tooltip formatter={(v)=>fmt(v)} /><Bar dataKey="montant" name="CA prévu" fill={TEAL} /></ComposedChart></ResponsiveContainer></div><div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16, marginBottom:18 }}><div style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:16}}><SectionTitle title="Suggestions intelligentes" />{suggestionsIA.map((s,i)=><div key={i} style={{padding:"9px 0",borderTop:i?`1px solid ${INK}0D`:"none",fontSize:13}}>💡 {s}</div>)}</div><div style={{background:CARD,border:`1px solid ${INK}0F`,borderRadius:12,padding:16}}><SectionTitle title="Alertes automatiques" />{anomaliesAuto.slice(0,8).map((a,i)=><div key={i} style={{padding:"9px 0",borderTop:i?`1px solid ${INK}0D`:"none",fontSize:13}}><b style={{color:a.niveau==="élevé"?CORAL:MUSTARD}}>{a.type}</b><br/>{a.description}</div>)}</div></div><SectionTitle title="Top 10 produits vendus" /><Table headers={["Produit","Quantité vendue","Chiffre d'affaires"]}>{topProduits.map((p,i)=><tr key={i} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{p.nom}</td><td style={cell}>{p.quantite}</td><td style={{...cell,color:TEAL,fontWeight:800}}>{fmt(p.ca)}</td></tr>)}</Table><div style={{height:18}}/><SectionTitle title="Top 10 clients" /><Table headers={["Client","Factures","Chiffre d'affaires"]}>{topClients.map((c,i)=><tr key={i} style={{borderTop:`1px solid ${INK}0D`}}><td style={cell}>{c.nom}</td><td style={cell}>{c.factures}</td><td style={{...cell,color:TEAL,fontWeight:800}}>{fmt(c.ca)}</td></tr>)}</Table><div style={{height:18}}/><SectionTitle title="Prévisions de stock" /><Table headers={["Produit","Stock","Moyenne/jour","Jours restants","Commande recommandée","Statut"]}>{stockPredictions.map((p,i)=><tr key={i} style={{borderTop:`1px solid ${INK}0D`,background:p.statut!=="OK"?`${CORAL}08`:"transparent"}}><td style={cell}>{p.produit}</td><td style={cell}>{p.stock}</td><td style={cell}>{p.moyenneJour.toFixed(2)}</td><td style={cell}>{p.joursRestants ?? "—"}</td><td style={{...cell,fontWeight:800}}>{p.quantiteRecommandee}</td><td style={{...cell,color:p.statut==="OK"?TEAL:CORAL,fontWeight:800}}>{p.statut}</td></tr>)}</Table><div style={{height:18}}/><SectionTitle title="Anomalies enregistrées" /><Table headers={["Date","Type","Description","Niveau","Statut","Actions"]}>{anomalies.map(a=><tr key={a.id} style={{borderTop:`1px solid ${INK}0D`,background:a.statut==="ouverte"?`${CORAL}08`:"transparent"}}><td style={cell}>{a.created_at ? new Date(a.created_at).toLocaleDateString("fr-FR") : "—"}</td><td style={cell}>{a.type_anomalie}</td><td style={cell}>{a.description}</td><td style={cell}>{a.niveau}</td><td style={cell}>{a.statut}</td><td style={cell}>{a.statut==="ouverte"&&<button onClick={()=>fermerAnomalie(a.id)} style={linkBtn(TEAL)}>Fermer</button>}</td></tr>)}</Table></>}



        {tab === "messagerie" && can("messagerie") && <><SectionTitle title="Messagerie" sub="Boîte de dialogue professionnelle avec le Super Admin : reçus, envoyés, non lus et traités." />
          <div style={{display:"grid",gridTemplateColumns:"minmax(220px,260px) 1fr",gap:18,alignItems:"start"}}>
            <div style={{background:CARD,border:`1px solid ${INK}12`,borderRadius:18,padding:16,boxShadow:"0 1px 4px rgba(21,34,56,0.06)",position:"sticky",top:18}}>
              <Button type="button" onClick={()=>{setMailBox("composer"); setMessageSaasForm({id:null,sujet:"Demande de création utilisateur",message:""});}}><Plus size={15}/> Nouveau message</Button>
              <div style={{height:14}} />
              <div style={{fontWeight:900,color:INK,marginBottom:10}}>Boîte mail</div>
              <div style={{display:"grid",gap:8}}>
                <MailBoxButton id="recus" label="Messages reçus" count={messagesRecus.length} active={mailBox==="recus"} onClick={()=>setMailBox("recus")} />
                <MailBoxButton id="envoyes" label="Messages envoyés" count={messagesEnvoyes.length} active={mailBox==="envoyes"} onClick={()=>setMailBox("envoyes")} />
                <MailBoxButton id="non_lus" label="Non lus" count={messagesNonLusListe.length} active={mailBox==="non_lus"} onClick={()=>setMailBox("non_lus")} />
                <MailBoxButton id="traites" label="Traités / lus" count={messagesTraites.length} active={mailBox==="traites"} onClick={()=>setMailBox("traites")} />
                <MailBoxButton id="tous" label="Tous les échanges" count={messagesScope.length} active={mailBox==="tous"} onClick={()=>setMailBox("tous")} />
              </div>
            </div>
            <div>
              <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:16}}><KpiCard label="Messages visibles" value={messagesScope.length} icon={FileText} accent={INK}/><KpiCard label="Non lus" value={messagesNonLusListe.length} icon={AlertTriangle} accent={messagesNonLusListe.length?CORAL:TEAL}/><KpiCard label="Envoyés" value={messagesEnvoyes.length} icon={FileText} accent={TEAL}/></div>
              <div style={{background:CARD,border:`1px solid ${INK}12`,borderRadius:16,padding:14,marginBottom:14}}>
                <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
                  <Field label="Recherche"><input style={{...inputStyle,minWidth:260}} placeholder="Sujet, message, statut..." value={mailSearch} onChange={e=>setMailSearch(e.target.value)}/></Field>
                  <Button type="button" secondary onClick={preRemplirCreationUtilisateur}>Modèle création utilisateur</Button>
                </div>
              </div>
              {mailBox === "composer" && <form onSubmit={envoyerMessageSaas} style={{...formStyle(CARD, INK),display:"grid",gap:12}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}><strong style={{fontSize:17,color:INK}}>Nouveau message</strong><span style={{fontSize:12,color:`${INK}88`,fontWeight:800}}>Destinataire : Super Admin</span></div>
                <Field label="Sujet"><select style={{...inputStyle,minWidth:280}} value={messageSaasForm.sujet} onChange={e=>setMessageSaasForm({...messageSaasForm,sujet:e.target.value})}><option>Demande de création utilisateur</option><option>Support technique</option><option>Demande abonnement / paiement</option><option>Autre demande</option></select></Field>
                <Field label="Message"><textarea style={{...inputStyle,width:"100%",minHeight:150,boxSizing:"border-box"}} value={messageSaasForm.message} onChange={e=>setMessageSaasForm({...messageSaasForm,message:e.target.value})} placeholder="Écrivez votre demande ici..." /></Field>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><Button type="submit">Envoyer au Super Admin</Button><Button type="button" secondary onClick={()=>setMailBox("recus")}>Retour</Button></div>
              </form>}
              {mailBox !== "composer" && <div>{getMessagesByBox(mailBox).length ? getMessagesByBox(mailBox).map(m => <MessageCard key={m.id} m={m} />) : <div style={{background:CARD,border:`1px dashed ${INK}22`,borderRadius:16,padding:24,color:`${INK}88`,fontWeight:800}}>Aucun message dans ce dossier.</div>}</div>}
            </div>
          </div>
        </>}

        {tab === "abonnement" && can("abonnement") && <><SectionTitle title="Mon abonnement" sub="Consultez votre formule, le nombre de jours restants et envoyez votre référence de paiement." />{isEntrepriseSysteme(entreprise) && <div style={{background:`${TEAL}10`,border:`1px solid ${TEAL}44`,borderRadius:18,padding:20,marginBottom:18}}><h3 style={{margin:"0 0 8px",color:TEAL}}>Plateforme système</h3><div style={{fontSize:14,color:INK,fontWeight:800}}>Cette plateforme appartient au propriétaire / SuperAdmin de Suivi PME. Elle est exclue de toute formule d’abonnement, alerte ou suspension automatique.</div></div>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16,marginBottom:18}}>
            <div style={{background:CARD,border:`1px solid ${abonnementPMEExpire?CORAL:abonnementPMEAlerte?MUSTARD:TEAL}44`,borderRadius:18,padding:20}}><div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"start"}}><div><div style={{fontSize:13,color:`${INK}88`,fontWeight:900,textTransform:"uppercase"}}>Statut abonnement</div><h2 style={{margin:"8px 0",color:abonnementPMEExpire?CORAL:abonnementPMEAlerte?MUSTARD:TEAL}}>{statutAbonnementPME}</h2><div style={{fontSize:13,color:`${INK}99`}}>Fin abonnement : <b>{dateFinAbonnementCourante ? formatDateFr(dateFinAbonnementCourante) : "Non renseignée"}</b></div></div><div style={{fontSize:36}}>{abonnementPMEExpire?"⛔":abonnementPMEAlerte?"⚠️":"✅"}</div></div><div style={{height:10}}/><div style={{height:9,background:`${INK}12`,borderRadius:999,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.max(0,Math.min(100,((joursRestantsAbonnement ?? 30)/30)*100))}%`,background:abonnementPMEExpire?CORAL:abonnementPMEAlerte?MUSTARD:TEAL}} /></div></div>
            <div style={{background:"linear-gradient(135deg,#ECFDF5,#FFFFFF)",border:`1px solid ${TEAL}33`,borderRadius:18,padding:20}}><div style={{fontSize:30}}>🎁</div><h3 style={{margin:"8px 0",color:INK}}>Essai Gratuit</h3><div style={{fontWeight:900,color:TEAL,fontSize:24}}>{fmt(0)}</div><p style={{fontSize:13,color:`${INK}99`,lineHeight:1.6}}>20 jours d'essai pour démarrer avec les modules essentiels.</p></div>
            <div style={{background:"linear-gradient(135deg,#EFF6FF,#FFFFFF)",border:"1px solid #2563EB44",borderRadius:18,padding:20}}><div style={{fontSize:30}}>👑</div><h3 style={{margin:"8px 0",color:INK}}>Abonnement Mensuel</h3><div style={{fontWeight:900,color:"#2563EB",fontSize:24}}>{fmt(ABONNEMENT_MENSUEL)} / mois</div><p style={{fontSize:13,color:`${INK}99`,lineHeight:1.6}}>Accès complet à tous les modules de Suivi PME.</p></div>
          </div>
          {(abonnementPMEAlerte || abonnementPMEExpire) && <div style={{background:abonnementPMEExpire?`${CORAL}10`:`${MUSTARD}10`,border:`1px solid ${abonnementPMEExpire?CORAL:MUSTARD}44`,borderRadius:14,padding:14,marginBottom:18,fontWeight:800,color:INK}}>⚠️ {abonnementPMEExpire ? `Votre abonnement est expiré. Veuillez renouveler ${fmt(ABONNEMENT_MENSUEL)} pour réactiver les modules bloqués.` : `Votre abonnement expire bientôt. Il reste ${joursRestantsAbonnement} jour(s).`}</div>}
          <form onSubmit={(e)=>{e.preventDefault();demanderPaiementMobile();}} style={formStyle(CARD, INK)}><Field label="Moyen de paiement"><PaymentSelect style={inputStyle} value={paiementLocalForm.moyen || "Wave"} onChange={m=>setPaiementLocalForm({...paiementLocalForm,moyen:m})} /></Field><Field label="Montant"><input type="number" min={ABONNEMENT_MENSUEL} style={{...inputStyle,width:150}} value={paiementLocalForm.montant} onChange={e=>setPaiementLocalForm({...paiementLocalForm,montant:e.target.value})}/></Field><Field label="Référence paiement"><input required style={{...inputStyle,minWidth:240}} placeholder="Référence Wave / OM / reçu" value={paiementLocalForm.reference} onChange={e=>setPaiementLocalForm({...paiementLocalForm,reference:e.target.value})}/></Field><Button type="submit">Envoyer au Super Admin</Button></form>
        </>}

        {tab === "parametres" && can("parametres") && <>
          <SectionTitle title="Paramètres entreprise" sub="Informations qui apparaîtront sur les factures et personnalisation de votre espace." />
          <div style={{background:themeCard,border:`1px solid ${activeTheme.border}`,borderRadius:20,padding:20,marginBottom:18,boxShadow:"0 14px 38px rgba(15,23,42,0.07)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap",marginBottom:18}}>
              <div>
                <h3 style={{margin:"0 0 5px",color:themeText,fontSize:18}}>Thèmes premium</h3>
                <div style={{fontSize:13,color:activeTheme.muted || `${INK}88`}}>6 thèmes propres et harmonisés pour un rendu professionnel. Le choix est sauvegardé par utilisateur.</div>
              </div>
              <select style={{...inputStyle,minWidth:260,borderColor:themeAccent,background:activeTheme.card,color:themeText}} value={themeKey} onChange={e=>changerTheme(e.target.value)}>
                {Object.entries(THEME_OPTIONS).map(([key,t]) => <option key={key} value={key}>{t.nom}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14}}>
              {Object.entries(THEME_OPTIONS).map(([key,t]) => {
                const selected = themeKey === key;
                return <button key={key} type="button" onClick={()=>changerTheme(key)} style={{textAlign:"left",border:`2px solid ${selected?t.accent:t.border}`,background:t.card,borderRadius:20,padding:0,cursor:"pointer",boxShadow:selected?`0 18px 40px ${t.accent}25`:"0 8px 20px rgba(15,23,42,0.06)",overflow:"hidden",transition:"all .18s ease"}}>
                  <div style={{height:76,background:`linear-gradient(135deg, ${t.sidebar} 0%, ${t.accent} 70%, ${t.secondary || t.accent} 100%)`,position:"relative"}}>
                    <div style={{position:"absolute",right:14,top:14,width:34,height:34,borderRadius:12,background:"rgba(255,255,255,.18)",border:"1px solid rgba(255,255,255,.25)"}} />
                    {selected && <div style={{position:"absolute",left:14,top:14,padding:"5px 9px",borderRadius:999,background:"rgba(255,255,255,.92)",color:t.accent,fontSize:11,fontWeight:900}}>ACTIF</div>}
                  </div>
                  <div style={{padding:16,background:t.card}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                      <div style={{fontWeight:950,color:t.text,fontSize:14}}>{t.nom}</div>
                      <div style={{display:"flex",gap:5}}>
                        {[t.accent,t.secondary,t.bg].map((c,i)=><span key={i} style={{width:17,height:17,borderRadius:999,background:c,border:`1px solid ${t.border}`,display:"inline-block"}} />)}
                      </div>
                    </div>
                    <div style={{fontSize:12,color:t.muted || "#64748B",marginTop:6,lineHeight:1.45}}>{t.description}</div>
                  </div>
                </button>;
              })}
            </div>
          </div>
          <form onSubmit={saveEntreprise} style={formStyle(CARD, INK)}>{["nom","email","adresse","ninea","rccm","logo_url"].map(k=><Field key={k} label={k.toUpperCase()}><input style={{...inputStyle,minWidth:220}} value={entrepriseForm[k]||""} onChange={e=>setEntrepriseForm({...entrepriseForm,[k]:e.target.value})}/></Field>)}<Field label="TÉLÉPHONE"><PhoneSNInput style={inputStyle} value={entrepriseForm.telephone} onChange={v=>setEntrepriseForm({...entrepriseForm,telephone:v})}/></Field><Button type="submit"><Save size={15}/> Enregistrer</Button></form>
        </>}
      </>}
    </main>
  </div>;
}

function Field({ label, children }) { return <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><label style={{ fontSize: 11.5, color: `${INK}88`, fontWeight: 700 }}>{label}</label>{children}</div>; }
function formStyle(CARD, INK) { return { background: CARD, borderRadius: 12, padding: 16, border: `1px solid ${INK}0F`, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 18 }; }
function linkBtn(color) { return { background: "none", border: "none", cursor: "pointer", color, marginRight: 8, fontWeight: 700 }; }
function personInputs(form, setForm, inputStyle) { return <><Field label="Nom"><input required style={{ ...inputStyle, minWidth: 190 }} value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} /></Field><Field label="Téléphone"><PhoneSNInput style={inputStyle} value={form.telephone} onChange={v => setForm({ ...form, telephone: v })} /></Field><Field label="Email"><input type="email" style={{ ...inputStyle, minWidth: 180 }} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></Field><Field label="Adresse"><input style={{ ...inputStyle, minWidth: 190 }} value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} /></Field></>; }
function renderPeopleTable(rows, edit, del, cell) { return <Table headers={["Code", "Nom", "Téléphone", "Email", "Adresse", "Actions"]}>{rows.map(r => { const code = r.code_client ? codeClient(r) : r.code_fournisseur ? codeFournisseur(r) : codeCourt("REF", r.id); return <tr key={r.id} style={{ borderTop: `1px solid ${INK}0D` }}><td style={cell}>{code}</td><td style={cell}>{r.nom}</td><td style={cell}>{r.telephone || "—"}</td><td style={cell}>{r.email || "—"}</td><td style={cell}>{r.adresse || "—"}</td><td style={cell}><button onClick={() => edit(r)} style={linkBtn(TEAL)}>Modifier</button><button onClick={() => del(r.id)} style={linkBtn(CORAL)}>Supprimer</button></td></tr>; })}</Table>; }
function PaginationPro({ page, pages, setPage }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 12, marginBottom: 12 }}>
      <div style={{ fontSize: 12.5, color: `${INK}88`, fontWeight: 800 }}>Page {page} / {pages || 1} — 5 lignes par page</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} style={{ background: "#fff", border: `1px solid ${INK}22`, borderRadius: 8, padding: "8px 12px", fontWeight: 800, cursor: page <= 1 ? "default" : "pointer", opacity: page <= 1 ? 0.45 : 1 }}>Précédent</button>
        <button type="button" disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))} style={{ background: "#fff", border: `1px solid ${INK}22`, borderRadius: 8, padding: "8px 12px", fontWeight: 800, cursor: page >= pages ? "default" : "pointer", opacity: page >= pages ? 0.45 : 1 }}>Suivant</button>
      </div>
    </div>
  );
}

function renderVentesTable(ventes, produits, clients, cell, deleteRow, imprimerFacture, facturesOnly = false) {
  return (
    <Table headers={["Date", "Référence", "Client", "Produits", "Qté totale", "Total facture", "Payé", "Reste", "Mode", "Statut", "Actions"]}>
      {ventes.map((v) => {
        const c = clients.find((x) => x.id === v.client_id);
        const lignes = v.lignes_facture || [v];
        const total = Number(v.total_facture ?? (Number(v.quantite || 0) * Number(v.prix_unitaire || 0)));
        const paye = Number(v.montant_paye || 0);
        const reste = Number(v.reste_a_payer || 0);
        const produitsLabel = v.produits_label || lignes.map((l) => {
          const p = produits.find((x) => x.id === l.produit_id);
          return `${p?.nom || "Produit"} x${l.quantite || 0}`;
        }).join(", ");
        const ids = lignes.map((l) => l.id).filter(Boolean);
        const supprimer = async () => {
          if (!window.confirm(`Supprimer toute la facture ${factureReferenceGroupe(v)} et ses ${ids.length} produit(s) ?`)) return;
          for (const id of ids) await deleteRow("ventes", id);
        };
        return (
          <tr key={v.id} style={{ borderTop: `1px solid ${INK}0D` }}>
            <td style={cell}>{v.date_vente}</td>
            <td style={cell}>{factureReferenceGroupe(v)}</td>
            <td style={cell}>{c?.nom || "Client non renseigné"}</td>
            <td style={{ ...cell, maxWidth: 320, whiteSpace: "normal", lineHeight: 1.45 }}>{produitsLabel || "—"}</td>
            <td style={cell}>{v.quantite_total || lignes.reduce((s,l)=>s+Number(l.quantite||0),0)}</td>
            <td style={{ ...cell, color: TEAL, fontWeight: 800 }}>{fmt(total)}</td>
            <td style={cell}>{fmt(paye)}</td>
            <td style={{ ...cell, color: reste > 0 ? CORAL : TEAL, fontWeight: 800 }}>{fmt(reste)}</td>
            <td style={cell}><PaymentBadge mode={v.mode_paiement || "Espèces"} /></td>
            <td style={cell}>{v.statut || "validée"}</td>
            <td style={cell}>
              <button onClick={() => imprimerFacture(v)} style={linkBtn(TEAL)}>Imprimer</button>
              {!facturesOnly && (
                <button onClick={supprimer} style={linkBtn(CORAL)}>Supprimer</button>
              )}
            </td>
          </tr>
        );
      })}
    </Table>
  );
}
