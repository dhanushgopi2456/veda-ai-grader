# -*- coding: utf-8 -*-
"""Generates sample question paper and answer sheet pages into public/samples/.

Requires fonts in scripts/fonts/ (Caveat, PatrickHand from Google Fonts; any serif
TTF renamed Times.ttf/Times-Bold.ttf/Times-Italic.ttf). The generated JPEGs are
committed in public/samples/, so this script is only needed to regenerate them.
"""
import json
import os
import random

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, "scripts", "fonts")
OUT = os.path.join(ROOT, "public", "samples")
W, H = 1240, 1754
INK = (28, 48, 132)
PAPER_LINE = (168, 190, 224)
MARGIN_RED = (222, 96, 96)

random.seed(7)


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def wrap(draw, text, f, max_w):
    words = text.split()
    lines, cur = [], ""
    for word in words:
        trial = (cur + " " + word).strip()
        if draw.textlength(trial, font=f) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def new_qp_page():
    img = Image.new("RGB", (W, H), (255, 255, 255))
    d = ImageDraw.Draw(img)
    return img, d


def qp_header(img, d, first):
    y = 70
    if first:
        school = font("Times-Bold.ttf", 40)
        t = "GREENFIELD PUBLIC SCHOOL"
        d.text(((W - d.textlength(t, font=school)) / 2, y), t, font=school, fill=(20, 20, 20))
        y += 58
        sub = font("Times.ttf", 26)
        t = "Half-Yearly Examination - September 2026"
        d.text(((W - d.textlength(t, font=sub)) / 2, y), t, font=sub, fill=(60, 60, 60))
        y += 40
        d.line([(90, y), (W - 90, y)], fill=(30, 30, 30), width=2)
        y += 16
        info = font("Times.ttf", 24)
        t = "Subject: Science (Biology)          Class: X          Time: 1 hr 30 min          Max. Marks: 20"
        d.text(((W - d.textlength(t, font=info)) / 2, y), t, font=info, fill=(40, 40, 40))
        y += 40
        inst = font("Times-Italic.ttf", 21)
        t = "General Instructions: (i) All questions are compulsory. (ii) Marks are indicated against each question."
        d.text(((W - d.textlength(t, font=inst)) / 2, y), t, font=inst, fill=(90, 90, 90))
        y += 34
        d.line([(90, y), (W - 90, y)], fill=(30, 30, 30), width=2)
        y += 34
    return y


def draw_question(d, y, label, text, marks, alt=None):
    qf = font("Times.ttf", 26)
    bf = font("Times-Bold.ttf", 26)
    max_w = W - 90 - 210 - 110
    lines = wrap(d, text, qf, max_w)
    d.text((100, y), label, font=bf, fill=(20, 20, 20))
    first = True
    for ln in lines:
        d.text((190, y), ln, font=qf, fill=(25, 25, 25))
        if first:
            m = "[%d]" % marks
            d.text((W - 90 - d.textlength(m, font=qf), y), m, font=qf, fill=(25, 25, 25))
        y += 38
        first = False
    if alt:
        it = font("Times-Italic.ttf", 25)
        for ln in wrap(d, alt, it, max_w - 90):
            d.text((250, y), ln, font=it, fill=(70, 70, 70))
            y += 36
    return y + 16


def gen_question_paper():
    pages = []
    img, d = new_qp_page()
    y = qp_header(img, d, True)
    y = draw_question(d, y, "1.", "Define photosynthesis. Name the organelle where it occurs.", 2)
    y = draw_question(d, y, "2.", "Draw a neat, labelled diagram of the human digestive system.", 3)
    y = draw_question(
        d, y, "3.",
        "Answer in one word or one sentence:  (a) What is a neuron?  (b) Which blood cells help the body fight infection?",
        2,
    )
    y = draw_question(
        d, y, "4.",
        "Explain the process of photosynthesis with the help of a balanced chemical equation.",
        4,
    )
    pages.append(img)

    img, d = new_qp_page()
    y = qp_header(img, d, False)
    y = draw_question(
        d, y, "5.",
        "Differentiate between arteries and veins. (Any three points)", 3,
        alt="OR  Explain double circulation in human beings.",
    )
    y = draw_question(
        d, y, "6.",
        "What are trophic levels? Draw a food chain with four trophic levels.", 3,
    )
    y = draw_question(
        d, y, "7.",
        "Fill in the blanks:  (a) The ______ is known as the powerhouse of the cell.  (b) The process of cell division is called ______.  (c) ______ gas is released during photosynthesis.",
        3,
    )
    y += 30
    end = font("Times-Bold.ttf", 26)
    t = "- END OF PAPER -"
    d.text(((W - d.textlength(t, font=end)) / 2, y), t, font=end, fill=(20, 20, 20))
    pages.append(img)
    return pages


def new_answer_page():
    img = Image.new("RGB", (W, H), (252, 251, 248))
    d = ImageDraw.Draw(img)
    y = 150
    while y < H - 60:
        d.line([(70, y), (W - 60, y)], fill=PAPER_LINE, width=2)
        y += 48
    d.line([(120, 40), (120, H - 40)], fill=MARGIN_RED, width=2)
    return img, d


HAND = "Caveat.ttf"
LABEL = "PatrickHand.ttf"


def hand_lines(d, x, y, lines, size=44, gap=48, color=INK, jitter=True):
    f = font(HAND, size)
    for i, ln in enumerate(lines):
        jx = random.randint(-2, 2) if jitter else 0
        jy = random.randint(-2, 2) if jitter else 0
        d.text((x + jx, y + jy), ln, font=f, fill=color)
        y += gap
    return y


def gen_answer_sheet():
    pages = []
    body = 44
    line_h = 48

    # ---- page 1
    img, d = new_answer_page()
    hf = font(LABEL, 30)
    d.text((160, 52), "Name: Ananya Sharma", font=hf, fill=(60, 70, 120))
    d.text((640, 52), "Roll No: 23", font=hf, fill=(60, 70, 120))
    d.text((900, 52), "Class: X-B", font=hf, fill=(60, 70, 120))

    y = 158
    d.text((150, y), "Ans 1.", font=font(LABEL, 34), fill=(20, 40, 110))
    y = hand_lines(d, 320, y + 2, [
        "Photosynthesis is the process by which green plants",
        "prepare their own food (glucose) from carbon dioxide",
        "and water, using sunlight and chlorophyll.",
    ], body, line_h)
    y += 4
    d.text((320, y), "It occurs in the chloroplast.", font=font(HAND, body), fill=INK)
    y += 96

    d.text((150, y), "Ans 3 (a)", font=font(LABEL, 34), fill=(20, 40, 110))
    d.text((380, y), "A neuron is the basic unit of the", font=font(HAND, body), fill=INK)
    d.text((380, y + line_h), "nervous system.", font=font(HAND, body), fill=INK)
    y += line_h * 2 + 44

    d.text((150, y), "Ans 3 (b)", font=font(LABEL, 34), fill=(20, 40, 110))
    d.text((380, y), "WBC - White Blood Cells.", font=font(HAND, body), fill=INK)
    pages.append(img)

    # ---- page 2
    img, d = new_answer_page()
    y = 158
    d.text((150, y), "Ans 4.", font=font(LABEL, 34), fill=(20, 40, 110))
    y = hand_lines(d, 320, y + 2, [
        "The process using roots is the absorption of",
        "water and mineral ions from the soil. The",
        "xylem carries water upward to the leaves.",
        "In the leaves, chlorophyll traps sunlight and",
        "converts water and CO2 into glucose.",
    ], body, line_h)
    y += 10
    d.text((420, y), "6CO2 + 6H2O  ->  C6H12O6 + 6O2", font=font(HAND, 46), fill=INK)
    d.text((520, y + line_h), "(in presence of sunlight + chlorophyll)", font=font(HAND, 32), fill=(90, 60, 140))
    pages.append(img)

    # ---- page 3
    img, d = new_answer_page()
    y = 158
    d.text((150, y), "Ans 6.", font=font(LABEL, 34), fill=(20, 40, 110))
    y = hand_lines(d, 320, y + 2, [
        "Trophic levels are the steps in a food chain",
        "where energy is transferred by eating and",
        "being eaten.",
    ], body, line_h)
    d.text((420, y), "Grass -> Grasshopper -> Frog -> Snake", font=font(HAND, 42), fill=INK)
    y += line_h * 2 + 40

    d.text((150, y), "N.B.", font=font(LABEL, 32), fill=(140, 60, 60))
    y = hand_lines(d, 320, y + 4, [
        "Extra note: the human heart has four",
        "chambers - two atria and two ventricles.",
    ], 40, line_h, color=(150, 60, 70))
    pages.append(img)
    return pages


def main():
    os.makedirs(OUT, exist_ok=True)
    manifest = {"questions": [], "answers": []}
    for i, page in enumerate(gen_question_paper(), 1):
        name = "question-paper-%d.jpg" % i
        page.save(os.path.join(OUT, name), "JPEG", quality=85)
        manifest["questions"].append(name)
    for i, page in enumerate(gen_answer_sheet(), 1):
        name = "answer-sheet-%d.jpg" % i
        page.save(os.path.join(OUT, name), "JPEG", quality=85)
        manifest["answers"].append(name)
    with open(os.path.join(OUT, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=2)
    print("Wrote", manifest)


if __name__ == "__main__":
    main()
