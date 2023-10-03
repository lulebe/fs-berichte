const tmpl = requiremain('./templates')

const { ExamType, Subject, ExamLocation, Examiner } = requiremain('./db/db')

module.exports = async (req, res) => {
    tmpl.render('app/newreport_prom.twig', res.tmplOpts).then(rendered => res.end(rendered))
}