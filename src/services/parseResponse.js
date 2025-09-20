export function parseResponse(medGemmaResult) {
  try {
    const responseText = medGemmaResult.choices?.[0]?.text ||
                        medGemmaResult.response ||
                        JSON.stringify(medGemmaResult);

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      // Validate and structure the comprehensive medical response
      return {
        primaryDiagnosis: {
          condition: parsed.primaryDiagnosis?.condition || "Unable to determine diagnosis",
          stage: validateStage(parsed.primaryDiagnosis?.stage) || "intermediate",
          confidence: validateConfidence(parsed.primaryDiagnosis?.confidence) || 0.5,
          evidenceMarkers: Array.isArray(parsed.primaryDiagnosis?.evidenceMarkers)
            ? parsed.primaryDiagnosis.evidenceMarkers
            : ["No specific markers identified"]
        },
        riskAssessment: {
          severity: validateSeverity(parsed.riskAssessment?.severity) || "moderate",
          urgency: validateUrgency(parsed.riskAssessment?.urgency) || "routine",
          progressionRisk: validateProgressionRisk(parsed.riskAssessment?.progressionRisk) || "stable"
        },
        predictiveAnalytics: {
          expectedProgression: parsed.predictiveAnalytics?.expectedProgression || "Unable to predict progression",
          timeframe: parsed.predictiveAnalytics?.timeframe || "Unknown timeframe",
          monitoringRecommendations: parsed.predictiveAnalytics?.monitoringRecommendations || "Regular follow-up recommended"
        },
        clinicalRecommendations: {
          immediateActions: parsed.clinicalRecommendations?.immediateActions || "Consult healthcare provider",
          diagnosticWorkup: parsed.clinicalRecommendations?.diagnosticWorkup || "Standard diagnostic evaluation",
          treatmentConsiderations: parsed.clinicalRecommendations?.treatmentConsiderations || "Follow standard treatment protocols",
          specialistReferral: parsed.clinicalRecommendations?.specialistReferral || "Consider specialist consultation if needed"
        },
        dataFusionInsights: {
          imagingFindings: parsed.dataFusionInsights?.imagingFindings || "No specific imaging findings noted",
          clinicalCorrelation: parsed.dataFusionInsights?.clinicalCorrelation || "Clinical correlation recommended",
          differentialDiagnosis: Array.isArray(parsed.dataFusionInsights?.differentialDiagnosis)
            ? parsed.dataFusionInsights.differentialDiagnosis
            : ["Consider alternative diagnoses"]
        },
        qualityMetrics: {
          imageQuality: parsed.qualityMetrics?.imageQuality || "Quality assessment unavailable",
          diagnosticLimitations: parsed.qualityMetrics?.diagnosticLimitations || "General limitations in AI analysis",
          recommendedImaging: parsed.qualityMetrics?.recommendedImaging || "Additional imaging may be beneficial"
        }
      };
    } else {
      // Fallback structure if no valid JSON found
      return createFallbackResponse(responseText);
    }
  } catch (parseError) {
    console.error('Error parsing MedGemma response:', parseError);
    return createErrorResponse();
  }
}

// Validation helper functions
function validateStage(stage) {
  const validStages = ["early", "intermediate", "advanced"];
  return validStages.includes(stage) ? stage : null;
}

function validateConfidence(confidence) {
  const conf = parseFloat(confidence);
  return (!isNaN(conf) && conf >= 0 && conf <= 1) ? conf : null;
}

function validateSeverity(severity) {
  const validSeverities = ["low", "moderate", "high", "critical"];
  return validSeverities.includes(severity) ? severity : null;
}

function validateUrgency(urgency) {
  const validUrgencies = ["routine", "urgent", "immediate"];
  return validUrgencies.includes(urgency) ? urgency : null;
}

function validateProgressionRisk(risk) {
  const validRisks = ["stable", "slow", "moderate", "rapid"];
  return validRisks.includes(risk) ? risk : null;
}

function createFallbackResponse(responseText) {
  return {
    primaryDiagnosis: {
      condition: "Analysis completed - review required",
      stage: "intermediate",
      confidence: 0.4,
      evidenceMarkers: ["Automated analysis completed"]
    },
    riskAssessment: {
      severity: "moderate",
      urgency: "routine",
      progressionRisk: "stable"
    },
    predictiveAnalytics: {
      expectedProgression: responseText.substring(0, 150) + "...",
      timeframe: "Unknown - requires clinical evaluation",
      monitoringRecommendations: "Standard monitoring protocols recommended"
    },
    clinicalRecommendations: {
      immediateActions: "Clinical review recommended",
      diagnosticWorkup: "Standard diagnostic evaluation",
      treatmentConsiderations: "Await clinical assessment",
      specialistReferral: "Consider specialist consultation"
    },
    dataFusionInsights: {
      imagingFindings: "Analysis attempted - clinical review needed",
      clinicalCorrelation: "Manual correlation recommended",
      differentialDiagnosis: ["Multiple conditions possible"]
    },
    qualityMetrics: {
      imageQuality: "Unable to assess automatically",
      diagnosticLimitations: "AI analysis limitations present",
      recommendedImaging: "Clinical assessment of imaging needs"
    }
  };
}

function createErrorResponse() {
  return {
    primaryDiagnosis: {
      condition: "Analysis error - manual review required",
      stage: "intermediate",
      confidence: 0.2,
      evidenceMarkers: ["Technical error occurred"]
    },
    riskAssessment: {
      severity: "moderate",
      urgency: "routine",
      progressionRisk: "stable"
    },
    predictiveAnalytics: {
      expectedProgression: "Unable to determine due to technical error",
      timeframe: "Unknown",
      monitoringRecommendations: "Standard clinical monitoring"
    },
    clinicalRecommendations: {
      immediateActions: "Manual clinical assessment required",
      diagnosticWorkup: "Standard diagnostic protocols",
      treatmentConsiderations: "Clinical judgment required",
      specialistReferral: "Consider appropriate specialist referral"
    },
    dataFusionInsights: {
      imagingFindings: "Technical error prevented analysis",
      clinicalCorrelation: "Manual clinical correlation required",
      differentialDiagnosis: ["Broad differential - clinical assessment needed"]
    },
    qualityMetrics: {
      imageQuality: "Unable to assess due to error",
      diagnosticLimitations: "Technical limitations encountered",
      recommendedImaging: "Clinical assessment required"
    }
  };
}