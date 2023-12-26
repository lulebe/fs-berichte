const { Petition, PetitionComment, PETITION_STATUS } = requiremain('./db/db')
const { getSetting, SETTINGS_KEYS } = requiremain('./db/stored_settings')

module.exports = async (req, res, next) => {
  if (!req.params.id) return res.status(404).send()
  const petition = await Petition.findByPk(req.params.id)
  if (!petition) return res.status(404).send()
  if (req.body.support === '1' && petition.status === PETITION_STATUS.ACTIVE) {
    await petition.addSupporter(req.user)
  }
  if (req.body.support === '0' && petition.status === PETITION_STATUS.ACTIVE) {
    await petition.removeSupporter(req.user)
  }
  if (req.body.comment) {
    await PetitionComment.create({PetitionId: petition.id, UserId: req.user.id, text: req.body.comment})
  }
  if (req.body.deletecomment) {
    const comment = await PetitionComment.findByPk(req.body.deletecomment)
    if (comment && (comment.UserId === req.user.id || req.user.isAdmin)) {
      await comment.destroy()
    }
  }
  if (req.body.deletepetition) {
    if (req.user.isAdmin || req.user.id === petition.UserId) {
      await petition.destroy()
      return res.redirect('/app/petitions')
    }
  }
  if (req.body.advance) {
    if (req.user.isAdmin || req.user.id === petition.UserId) {
      if (petition.status < 4) {
        if (req.user.isAdmin ||petition.status !== 0 || (await getSetting(SETTINGS_KEYS.PETITIONS_REQUIRE_ADMIN_CONFIRMATION)) === '0') {
          petition.status++
          await petition.save()
        } else {
          res.tmplOpts.requireAdminConfirmationMsg = true
        }
      }
    }
  }
  if (req.body.back) {
    if (req.user.isAdmin || req.user.id === petition.UserId) {
      if (petition.status > 0) {
        petition.status--
        await petition.save()
      }
    }
  }
  next()
}