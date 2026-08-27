from pathlib import Path
from fpdf import FPDF


class ChecklistPDF(FPDF):
    def header(self):
        self.set_fill_color(183, 255, 56)
        self.rect(0, 0, 210, 18, style="F")
        self.set_text_color(11, 13, 12)
        self.set_font("Helvetica", "B", 8)
        self.set_xy(16, 6)
        self.cell(0, 5, "CAIRN CAREERS  /  FIRST-JOB FIELD GUIDE")

    def footer(self):
        self.set_y(-16)
        self.set_text_color(78, 85, 79)
        self.set_font("Helvetica", "", 8)
        self.cell(0, 5, "Use this as a prompt for a conversation, not a prediction.", align="L")
        self.cell(0, 5, f"{self.page_no()}", align="R")


pdf = ChecklistPDF(format="A4")
pdf.set_auto_page_break(auto=True, margin=22)
pdf.add_page()
pdf.set_xy(16, 28)
pdf.set_text_color(11, 13, 12)
pdf.set_font("Helvetica", "B", 25)
pdf.multi_cell(0, 11, "First-Job AI\nReadiness Checklist")
pdf.ln(4)
pdf.set_font("Helvetica", "", 12)
pdf.multi_cell(0, 6, "Seven questions to take into your next adviser, recruiter, or first-job conversation.")
pdf.ln(8)

questions = [
    ("01", "What job goal am I testing?", "Name a role, a field, and one real work setting. A clear target makes the evidence you need easier to see."),
    ("02", "What have I already done that resembles the work?", "List coursework, internships, projects, volunteering, or paid work. Start with the work itself, not the title."),
    ("03", "Which part of that work required judgment?", "Mark where you framed a question, heard a pattern, made a trade-off, or helped someone decide what to do next."),
    ("04", "Which tasks are likely to change with AI?", "Separate tasks that can be automated from work that needs context, responsibility, and a person who can explain a choice."),
    ("05", "What evidence can I show?", "Choose one artifact, number, or short story that proves the work happened and tells another person why it mattered."),
    ("06", "Who can help me test this route?", "Name one person already close to the work: a professor, supervisor, alumnus, classmate, or second-degree connection."),
    ("07", "What is one next move I can complete this week?", "Make it concrete: send a message, revise a bullet, publish a small artifact, or book one conversation."),
]

for number, question, guidance in questions:
    if pdf.get_y() > 241:
        pdf.add_page()
        pdf.set_xy(16, 28)
    pdf.set_fill_color(247, 249, 243)
    pdf.set_draw_color(11, 13, 12)
    pdf.set_line_width(0.7)
    y = pdf.get_y()
    pdf.rect(16, y, 178, 29, style="DF")
    pdf.set_fill_color(31, 227, 227)
    pdf.rect(16, y, 19, 29, style="DF")
    pdf.set_xy(20, y + 11)
    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(11, 6, number)
    pdf.set_xy(41, y + 5)
    pdf.set_font("Helvetica", "B", 12)
    pdf.multi_cell(145, 6, question)
    pdf.set_xy(41, y + 13)
    pdf.set_font("Helvetica", "", 9.5)
    pdf.multi_cell(145, 4.7, guidance)
    pdf.set_y(y + 34)

pdf.ln(2)
pdf.set_fill_color(11, 13, 12)
pdf.set_text_color(255, 255, 255)
pdf.rect(16, pdf.get_y(), 178, 27, style="F")
pdf.set_xy(22, pdf.get_y() + 6)
pdf.set_font("Helvetica", "B", 10)
pdf.cell(0, 5, "A useful first move")
pdf.set_xy(22, pdf.get_y() + 12)
pdf.set_font("Helvetica", "", 9.5)
pdf.multi_cell(160, 4.7, "Bring your answers to one real conversation. Your goal is not to predict the next three years; it is to make the next decision smaller, more specific, and easier to test.")

output = Path(__file__).resolve().parents[1] / "landing-page" / "client" / "public" / "downloads" / "cairn-first-job-ai-readiness-checklist.pdf"
output.parent.mkdir(parents=True, exist_ok=True)
pdf.output(str(output))
