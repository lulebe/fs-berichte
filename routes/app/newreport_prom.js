const tmpl = requiremain('./templates')

const { ExamType, Subject, ExamLocation, Examiner } = requiremain('./db/db')

module.exports = async (req, res) => {
    const d = new Date()
    res.tmplOpts.currentDate = d.getUTCFullYear() + "-" + (d.getUTCMonth()+1+"").padStart(2, "0") + "-" + (""+d.getUTCDate()).padStart(2, "0")
    tmpl.render('app/newreport_prom.twig', res.tmplOpts).then(rendered => res.end(rendered))
}