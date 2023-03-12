package com.mwozniak.capser_v2.controllers.tournament;

import com.mwozniak.capser_v2.models.database.tournament.singles.SinglesTournament;
import com.mwozniak.capser_v2.service.tournament.SoloTournamentService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/singles/tournaments")
public class SinglesTournamentController extends AbstractSinglesTournamentController<SinglesTournament> {
    public SinglesTournamentController(SoloTournamentService singlesTournamentService) {
        super(singlesTournamentService);
    }
}
